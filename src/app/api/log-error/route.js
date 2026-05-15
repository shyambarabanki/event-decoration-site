import { NextResponse } from "next/server";
import { logError, logInfo } from "../../../lib/logger";
import { getSessionId } from "../../../lib/server-session";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const sessionId = await getSessionId();

    await logError(
      body?.source || "client",
      new Error(body?.message || "Client error"),
      {
        sessionId,
        url: body?.url || "",
        stack: body?.stack || "",
        componentStack: body?.componentStack || "",
        metadata: body?.metadata || {},
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to write client log:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sessionId = await getSessionId();
    await logInfo("healthcheck", "Log API checked", { sessionId });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

