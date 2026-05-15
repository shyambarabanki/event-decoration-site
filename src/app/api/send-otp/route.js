import { logError } from "../../../lib/logger";

export async function POST(req) {
  try {
    const { mobile, token } = await req.json();

    if (!mobile) {
      return new Response(JSON.stringify({ success: false, error: "Mobile is required" }), { status: 400 });
    }

    // Ensure token is available
    let authToken = token || global.messageCentralToken?.token;
    if (!authToken || Date.now() - (global.messageCentralToken?.createdAt || 0) > 4 * 60 * 1000) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-token`, { method: "GET" });
      const data = await res.json();
      if (!data.success) throw new Error("Failed to get auth token");
      authToken = data.token;
      global.messageCentralToken = { token: authToken, createdAt: Date.now() };
    }

    // Send OTP via MessageCentral
    const url = `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&flowType=SMS&mobileNumber=${mobile}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        authToken, // <-- this is the correct header
        accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ success: false, error: data?.message || "OTP send failed" }), { status: response.status });
    }

    return new Response(JSON.stringify({ success: true, message: "OTP sent successfully", data }), { status: 200 });
  } catch (err) {
    console.error("Send OTP Error:", err);
    await logError("api/send-otp", err).catch(console.error);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
