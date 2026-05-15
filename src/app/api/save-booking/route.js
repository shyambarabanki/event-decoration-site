import { google } from "googleapis";
import path from "path";
import fs from "fs";
import { appendOrder, createBookingId } from "../../../lib/order-store";
import { logError } from "../../../lib/logger";
import { getSessionId } from "../../../lib/server-session";

const keyPath = path.resolve(
  process.cwd(),
  "event-booking-service-bc34e672a371.json"
);
const keyFileContent = JSON.parse(fs.readFileSync(keyPath, "utf8"));

const auth = new google.auth.JWT({
  email: keyFileContent.client_email,
  key: keyFileContent.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SHEET_ID = "1W6fbZh9ezvQDzRf51SyLfx5ABpR8JfwIH161wXTjUI4";

export async function POST(req) {
  const sessionId = await getSessionId();

  try {
    const body = await req.json();

    const bookingId = createBookingId();
    const designId = String(body.designId || "").trim();
    const type = String(body.type || "").trim();
    const mobile = String(body.mobile || "").trim();
    const pincode = String(body.pincode || "").trim();
    const date = String(body.date || "").trim();
    const time = String(body.time || "").trim();
    const name = String(body.name || "").trim();
    const address = String(body.address || "").trim();
    const city = String(body.city || "").trim();
    const state = String(body.state || "").trim();
    const zip = String(body.zip || "").trim();
    const verified = Boolean(body.verified);
    const paymentStatus = String(body.paymentStatus || "pending").trim();
    const bookingType = String(body.bookingType || "pre-booking").trim();

    const missingFields = [];
    if (!designId) missingFields.push("designId");
    if (!mobile) missingFields.push("mobile");
    if (!pincode) missingFields.push("pincode");
    if (!date) missingFields.push("date");
    if (!time) missingFields.push("time");
    if (!name) missingFields.push("name");
    if (!address) missingFields.push("address");
    if (!city) missingFields.push("city");
    if (!state) missingFields.push("state");
    if (!zip) missingFields.push("zip");

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        }),
        { status: 400 }
      );
    }

    const sheets = google.sheets({ version: "v4", auth });
    const createdDate = new Date().toISOString();
    const order = {
      bookingId,
      sessionId,
      designId,
      type,
      mobile,
      pincode,
      date,
      time,
      name,
      address,
      city,
      state,
      zip,
      verified,
      paymentStatus,
      bookingType,
      status: "created",
      createdAt: createdDate,
      updatedAt: createdDate,
    };

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            designId,
            type,
            mobile,
            pincode,
            date,
            time,
            name,
            address,
            city,
            state,
            zip,
            createdDate,
            bookingId,
            sessionId,
            verified ? "verified" : "guest_unverified",
            paymentStatus,
            bookingType,
          ],
        ],
      },
    });

    await appendOrder(order);

    return new Response(
      JSON.stringify({
        success: true,
        bookingId,
        order,
        message:
          "✅ Thank you for booking. We have captured your details and will get back to you soon.",
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Google Sheets API Error:", err);
    await logError("api/save-booking", err, { sessionId }).catch(console.error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to save booking" }),
      { status: 500 }
    );
  }
}
