import Razorpay from "razorpay";

export async function POST(req) {
  try {
    const { amount, bookingId } = await req.json();

    if (!amount || !bookingId) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `booking_${bookingId}`,
      payment_capture: 1, // auto capture
    };

    const order = await razorpay.orders.create(options);

    return new Response(JSON.stringify({ success: true, order }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: "Order creation failed" }), { status: 500 });
  }
}
