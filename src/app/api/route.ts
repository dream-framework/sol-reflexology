import { NextResponse } from "next/server";

// Mark as static so the route can be included in `output: 'export'` builds.
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}
