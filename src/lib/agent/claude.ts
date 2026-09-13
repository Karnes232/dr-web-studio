import "server-only"
import Anthropic from "@anthropic-ai/sdk"
import { systemPersona } from "./prompt"
import { runTool, TOOLS, type ToolContext } from "./tools"
import type { AgentKnowledge } from "@/sanity/queries/agent/agentKnowledge"
import type { Conversation, Tenant } from "@/lib/whatsapp/store"

/** Opus 5 list price, USD per million tokens. */
const PRICE = {
  input: 5.0,
  output: 25.0,
  cacheRead: 0.5, // 0.1x input
  cacheWrite: 6.25, // 1.25x input
} as const

/** A stuck model must not bankrupt the turn. */
const MAX_TOOL_ITERATIONS = 5

export interface TurnUsage {
  inputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
  costUsd: number
  /** Claude API calls this turn took. >1 means tools ran; each call re-sends
   *  the whole prefix, so this is a first-class cost driver. */
  apiCalls: number
}

export interface TurnResult {
  reply: string
  escalated?: { reason: string; urgency: string }
  usage: TurnUsage
}

export interface TurnParams {
  tenant: Tenant
  conversation: Conversation
  /** Pre-rendered, byte-stable knowledge block — see lib/agent/knowledge.ts. */
  knowledgeBlock: string
  knowledge: AgentKnowledge
  /** Full turn history, oldest first, ending with the customer's latest. */
  history: Anthropic.MessageParam[]
  locale: string
  waId: string
  profileName?: string
}

let client: Anthropic | null = null
function anthropic(): Anthropic {
  if (!client) client = new Anthropic()
  return client
}

function tally(u: Anthropic.Usage | undefined, acc: TurnUsage): void {
  if (!u) return
  const cacheRead = u.cache_read_input_tokens ?? 0
  const cacheWrite = u.cache_creation_input_tokens ?? 0
  acc.inputTokens += u.input_tokens ?? 0
  acc.outputTokens += u.output_tokens ?? 0
  acc.cacheReadTokens += cacheRead
  acc.cacheWriteTokens += cacheWrite
  acc.costUsd +=
    ((u.input_tokens ?? 0) * PRICE.input +
      (u.output_tokens ?? 0) * PRICE.output +
      cacheRead * PRICE.cacheRead +
      cacheWrite * PRICE.cacheWrite) /
    1_000_000
}

/**
 * Run one conversational turn.
 *
 * Prompt layout is deliberate — render order is `tools` → `system` →
 * `messages`, so everything stable goes first and everything volatile last:
 *
 *   tools            frozen, same order every call
 *   system[0]        persona (small, per tenant)
 *   system[1]        knowledge base + cache_control ttl 1h  ← the cached prefix
 *   messages         history, then a mid-conversation system message carrying
 *                    the volatile state (clock, customer name)
 *
 * The volatile state must NOT go in `system`: a clock there would change the
 * prefix on every request and silently destroy the cache. Opus 5 accepts a
 * `{role: "system"}` entry inside `messages`, which is the operator channel
 * that leaves the cached prefix untouched.
 *
 * 1-hour TTL rather than the 5-minute default because WhatsApp conversations
 * are bursty over hours — at 5 minutes almost every turn would re-pay the
 * cache-write premium.
 */
export async function runTurn(params: TurnParams): Promise<TurnResult> {
  const { tenant, knowledgeBlock, history, locale } = params

  const usage: TurnUsage = {
    inputTokens: 0,
    outputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
    costUsd: 0,
    apiCalls: 0,
  }

  const now = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Santo_Domingo",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date())

  const volatile = [
    `Current local time in the Dominican Republic: ${now}.`,
    `Conversation language: ${locale}.`,
    params.profileName
      ? `The customer's WhatsApp name is ${params.profileName}.`
      : "",
    params.conversation.turn_count === 0
      ? "This is your FIRST reply in this conversation — introduce yourself as an assistant here."
      : "You have already introduced yourself; do not do it again.",
  ]
    .filter(Boolean)
    .join(" ")

  const messages: Anthropic.MessageParam[] = [
    ...history,
    // Must follow a user turn and be last — both hold here. `MessageParam.role`
    // natively includes "system"; no cast needed.
    { role: "system", content: volatile },
  ]

  const ctx: ToolContext = {
    tenant: params.tenant,
    conversation: params.conversation,
    knowledge: params.knowledge,
    waId: params.waId,
    profileName: params.profileName,
    locale,
  }

  let escalated: TurnResult["escalated"]
  let reply = ""

  for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
    const response = await anthropic().messages.create({
      model: tenant.model || "claude-opus-5",
      max_tokens: 1024, // WhatsApp replies must be short
      output_config: { effort: "low" }, // chat does not repay high effort
      // Thinking is left ON (adaptive is the Opus 5 default). Disabling it has
      // a documented failure mode where the model writes a tool call into
      // visible text instead of emitting a tool_use block — the turn succeeds,
      // the tool never runs, and no error is raised.
      system: [
        { type: "text", text: systemPersona(tenant) },
        {
          type: "text",
          text: knowledgeBlock,
          cache_control: { type: "ephemeral", ttl: "1h" },
        },
      ],
      tools: TOOLS,
      messages,
    })

    usage.apiCalls += 1
    tally(response.usage, usage)

    for (const block of response.content) {
      if (block.type === "text") reply += (reply ? "\n" : "") + block.text
    }

    if (response.stop_reason !== "tool_use") break

    const toolUses = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    )
    if (!toolUses.length) break

    messages.push({ role: "assistant", content: response.content })

    // All results go back in ONE user message — splitting them trains the
    // model out of parallel tool calls.
    const results: Anthropic.ToolResultBlockParam[] = []
    for (const use of toolUses) {
      try {
        const outcome = await runTool(
          use.name,
          (use.input ?? {}) as Record<string, unknown>,
          ctx,
        )
        if (outcome.escalated) escalated = outcome.escalated
        results.push({
          type: "tool_result",
          tool_use_id: use.id,
          content: outcome.result,
        })
      } catch (error) {
        console.error(`agent tool ${use.name} threw:`, error)
        results.push({
          type: "tool_result",
          tool_use_id: use.id,
          content: "Tool failed. Do not retry; continue without it.",
          is_error: true,
        })
      }
    }
    messages.push({ role: "user", content: results })
  }

  if (usage.cacheReadTokens === 0 && usage.cacheWriteTokens === 0) {
    console.warn(
      "agent: no prompt-cache activity — the system prefix may be varying per request",
    )
  }

  return { reply: reply.trim(), escalated, usage }
}

/** Most-specific-first, so a rate limit is distinguishable from a bad request. */
export function describeClaudeError(error: unknown): string {
  if (error instanceof Anthropic.RateLimitError) return "rate limited"
  if (error instanceof Anthropic.AuthenticationError)
    return "bad ANTHROPIC_API_KEY"
  if (error instanceof Anthropic.BadRequestError)
    return `bad request: ${error.message}`
  if (error instanceof Anthropic.APIError)
    return `api error ${error.status}: ${error.message}`
  return String(error)
}
