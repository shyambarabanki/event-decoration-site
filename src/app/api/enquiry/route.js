import { google } from "googleapis";
import path from "path";
import fs from "fs";
import { logError } from "../../../lib/logger";

// Load service account JSON
const keyPath = path.resolve(
  process.cwd(),
  "event-booking-service-bc34e672a371.json"
);
const keyFileContent = JSON.parse(fs.readFileSync(keyPath, "utf8"));

// Create JWT auth client
const auth = new google.auth.JWT({
  email: keyFileContent.client_email,
  key: keyFileContent.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Google Sheet ID
const SHEET_ID = "1i2KS7seZKwXYB6UhaZDhrNrWA7wMbBvUVAi6_2iF5aE";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, mobile, eventType, message } = body;

    if (!name || !email || !mobile || !eventType) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const sheets = google.sheets({ version: "v4", auth });
    const createdDate = new Date().toISOString();

    // Append new row to the same sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [name, email, mobile, eventType, message || "", createdDate],
        ],
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "✅ Thank you for your inquiry. We have captured your details and will get back to you soon.",
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Google Sheets API Error:", err);
    await logError("api/enquiry", err).catch(console.error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to save inquiry" }),
      { status: 500 }
    );
  }
}
