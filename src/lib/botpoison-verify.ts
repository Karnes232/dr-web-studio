export async function verifyBotpoisonSolution(
  solution: string,
): Promise<boolean> {
  const secretKey = process.env.BOTPOISON_SECRET_KEY
  if (!secretKey) {
    console.error("BOTPOISON_SECRET_KEY is not set")
    return false
  }
  const res = await fetch("https://api.botpoison.com/verify", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({ secretKey, solution }),
  })
  if (!res.ok) return false
  const data = (await res.json()) as { ok?: boolean }
  return data.ok === true
}

export function clampString(value: unknown, max: number): string {
  if (typeof value !== "string") return ""
  const t = value.trim()
  return t.length > max ? t.slice(0, max) : t
}
