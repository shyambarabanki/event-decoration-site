// src/app/api/check-pincode/route.js

export async function POST(req) {
  try {
    const body = await req.json();
    const { pincode } = body;

    // Example logic: list of serviceable pincodes
    const availablePincodes = ["225001","225123","225203","226001","226003","226006", "226010","226016","226017", "226018","226020","226021","227105","226004","227308","226028"]; // replace with DB lookup if needed

    const isAvailable = availablePincodes.includes(pincode);

    return new Response(
      JSON.stringify({ success: true, available: isAvailable }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Optional: allow GET for testing in browser
export async function GET() {
  return NextResponse.json({ success: true, message: "Check-pincode API is live" });
}