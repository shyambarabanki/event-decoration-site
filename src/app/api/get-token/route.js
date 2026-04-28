export async function GET() {
  try {
    const baseUrl = "https://cpaas.messagecentral.com";
    const customerId = process.env.MESSAGECENTRAL_CUSTOMER_ID;
    const key = process.env.MESSAGECENTRAL_KEY;
    const email = process.env.MESSAGECENTRAL_EMAIL;

    const tokenUrl = `${baseUrl}/auth/v1/authentication/token?customerId=${customerId}&key=${key}&scope=NEW&country=91&email=${email}`;

    const response = await fetch(tokenUrl, {
      method: "GET",
      headers: { accept: "*/*" },
    });

    if (!response.ok) {
      throw new Error(`Token fetch failed: ${response.statusText}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ success: true, token: data.token }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching token:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}