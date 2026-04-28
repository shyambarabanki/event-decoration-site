// src/app/api/verify-otp/route.js
export async function POST(req) {
  try {
    const { verificationId, code } = await req.json();
    const authToken = req.headers.get("authorization"); // or pass from frontend

    if (!verificationId || !code) {
      return new Response(
        JSON.stringify({ success: false, error: "verificationId and code required" }),
        { status: 400 }
      );
    }

    const url = `https://cpaas.messagecentral.com/verification/v3/validateOtp?verificationId=${verificationId}&code=${code}`;
    const verifyRes = await fetch(url, {
      headers: {
        authToken: authToken || "",
      },
    });

    const text = await verifyRes.text();
    const data = text ? JSON.parse(text) : {};

    if (data?.data?.verificationStatus === "VERIFICATION_COMPLETED") {
      return new Response(JSON.stringify({ success: true }));
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: data?.data?.errorMessage || data?.message || "OTP not verified",
        }),
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("Verify OTP error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
    });
  }
}