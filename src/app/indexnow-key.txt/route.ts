import { NextResponse } from "next/server"

// Serves the IndexNow verification key (the file body is exactly the key).
// Kept in env (INDEXNOW_KEY) rather than a committed file so it stays
// configurable and out of git. Referenced as `keyLocation` in submissions.
export async function GET() {
  const key = process.env.INDEXNOW_KEY
  if (!key) return new NextResponse("Not found", { status: 404 })

  return new NextResponse(key, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
