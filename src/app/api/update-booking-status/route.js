import { NextResponse } from "next/server";
import { updateOrderByBookingId } from "../../../lib/order-store";
import { logError } from "../../../lib/logger";
import { getSessionId } from "../../../lib/server-session";

export async function POST(req) {
  const sessionId = await getSessionId();

  try {
    const body = await req.json();
    const bookingId = String(body?.bookingId || "").trim();

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "bookingId is required" },
        { status: 400 }
      );
    }

    const updatedOrder = await updateOrderByBookingId(bookingId, sessionId, {
      paymentMode: String(body?.paymentMode || "pending"),
      paymentStatus: String(body?.paymentStatus || "pending"),
      status: String(body?.status || "confirmed"),
    });

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: "Booking not found for this session" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    await logError("api/update-booking-status", error, { sessionId }).catch(console.error);
    return NextResponse.json(
      { success: false, error: "Failed to update booking status" },
      { status: 500 }
    );
  }
}
