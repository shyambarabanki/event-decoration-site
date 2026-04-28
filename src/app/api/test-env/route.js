export async function GET() {
  const data = {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    customerId: process.env.MESSAGECENTRAL_CUSTOMER_ID,
    key: process.env.MESSAGECENTRAL_KEY ? "✅ Loaded" : "❌ Missing",
    email: process.env.MESSAGECENTRAL_EMAIL,
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}