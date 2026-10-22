import { describe, expect, it } from "vitest"
import { TEAM_MARKER, toHistoryMessage } from "./store"

/**
 * Every outbound row replays as `assistant`, whoever wrote it. A person's
 * messages carry a marker so the model does not mistake James's proposal for
 * something it said itself.
 */
describe("toHistoryMessage", () => {
  it("replays the customer as the user, unchanged", () => {
    expect(
      toHistoryMessage({
        direction: "inbound",
        body: "Hola",
        authored_by: null,
      }),
    ).toEqual({ role: "user", content: "Hola" })
  })

  it("replays the agent's own reply unmarked", () => {
    expect(
      toHistoryMessage({
        direction: "outbound",
        body: "¡Hola Isabel!",
        authored_by: "agent",
      }),
    ).toEqual({ role: "assistant", content: "¡Hola Isabel!" })
  })

  it("marks what a person on the team wrote", () => {
    expect(
      toHistoryMessage({
        direction: "outbound",
        body: "Sitio web para tu arte — US$900",
        authored_by: "human",
      }),
    ).toEqual({
      role: "assistant",
      content: `${TEAM_MARKER}Sitio web para tu arte — US$900`,
    })
  })

  it("leaves rows from before authorship was recorded unmarked", () => {
    expect(
      toHistoryMessage({ direction: "outbound", body: "Hi" }).content,
    ).toBe("Hi")
  })
})
