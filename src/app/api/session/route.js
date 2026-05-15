import { NextResponse } from "next/server";
import { getSessionId } from "../../../lib/server-session";

export async function GET() {
  const sessionId = await getSessionId();
  return NextResponse.json({
    success: true,
    sessionId,
    mode: "guest",
  });
}

