import { google } from "googleapis";
import path from "path";
import fs from "fs";

// Load service account JSON
const keyPath = path.resolve(process.cwd(), "event-booking-service-bc34e672a371.json");
const keyFileContent = JSON.parse(fs.readFileSync(keyPath, "utf8"));

// Create JWT auth client
const auth = new google.auth.JWT({
  email: keyFileContent.client_email,
  key: keyFileContent.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Google Sheet ID
const SHEET_ID = "1W6fbZh9ezvQDzRf51SyLfx5ABpR8JfwIH161wXTjUI4";

export async function POST(req) {
  try {
    const body = await req.json();
    const { designId, type, mobile, pincode, date, time, name, address, city, state, zip } = body;

    if (!designId || !mobile || !pincode || !date || !time || !name || !address || !city || !state || !zip) {
      return new Response(JSON.stringify({ success: false, error: "Missing required fields" }), { status: 400 });
    }

    const sheets = google.sheets({ version: "v4", auth });
    const createdDate = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [designId, type, mobile, pincode, date, time, name, address, city, state, zip, createdDate],
        ],
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "✅ Thank you for booking. We have captured your details and will get back to you soon.",
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Google Sheets API Error:", err);
    return new Response(JSON.stringify({ success: false, error: "Failed to save booking" }), { status: 500 });
  }
}
