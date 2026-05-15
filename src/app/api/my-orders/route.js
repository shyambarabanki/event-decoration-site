import { NextResponse } from "next/server";
import { getOrdersBySession } from "../../../lib/order-store";
import { logError } from "../../../lib/logger";
import { getSessionId } from "../../../lib/server-session";

export async function GET() {
  const sessionId = await getSessionId();

  try {
    const orders = await getOrdersBySession(sessionId);
    return NextResponse.json({
      success: true,
      sessionMode: "guest",
      orders,
    });
  } catch (error) {
    await logError("api/my-orders", error, { sessionId }).catch(console.error);
    return NextResponse.json(
      { success: false, error: "Failed to load orders" },
      { status: 500 }
    );
  }
}
