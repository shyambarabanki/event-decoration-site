// src/app/api/check-pincode/route.js

import { NextResponse } from "next/server";
import { logError } from "../../../lib/logger";

const SERVICEABLE_PINCODES = new Set([
  "225001",
  "225123",
  "225203",
  "226001",
  "226003",
  "226004",
  "226006",
  "226010",
  "226016",
  "226017",
  "226018",
  "226020",
  "226021",
  "226028",
  "227105",
  "227308",
]);

const SERVICEABLE_DISTRICTS = new Set(
  ["Gautam Buddha Nagar", "Gautam Buddh Nagar", "Gautam Budh Nagar", "Lucknow"].map(
    normalizeLocation
  )
);

function normalizeLocation(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function isServiceableOffice(office) {
  return SERVICEABLE_DISTRICTS.has(normalizeLocation(office?.District));
}

function createPincodeResponse(payload, status = 200) {
  return NextResponse.json(payload, { status });
}

function createLookupFailureResponse(isKnownServiceablePincode) {
  return createPincodeResponse(
    {
      success: isKnownServiceablePincode,
      available: isKnownServiceablePincode,
      message: isKnownServiceablePincode
        ? "Serviceable area"
        : "Failed to check pincode. Try again later.",
    },
    isKnownServiceablePincode ? 200 : 502
  );
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const pincode = String(body?.pincode || "").trim();

    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return createPincodeResponse(
        {
          success: false,
          available: false,
          message: "Enter valid pincode",
        },
        400
      );
    }

    const isKnownServiceablePincode = SERVICEABLE_PINCODES.has(pincode);

    let response;
    try {
      response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
        cache: "no-store",
      });
    } catch {
      return createLookupFailureResponse(isKnownServiceablePincode);
    }

    if (!response.ok) {
      return createLookupFailureResponse(isKnownServiceablePincode);
    }

    let data;
    try {
      data = await response.json();
    } catch {
      return createLookupFailureResponse(isKnownServiceablePincode);
    }

    const result = Array.isArray(data) ? data[0] : null;
    const postOffices = Array.isArray(result?.PostOffice) ? result.PostOffice : [];

    if (result?.Status === "Error" || !postOffices.length) {
      return createPincodeResponse(
        {
          success: isKnownServiceablePincode,
          available: isKnownServiceablePincode,
          message: isKnownServiceablePincode ? "Serviceable area" : "Enter valid pincode",
        },
        isKnownServiceablePincode ? 200 : 404
      );
    }

    const matchedOffice = postOffices.find(isServiceableOffice);
    const primaryOffice = matchedOffice || postOffices[0] || {};
    const available = isKnownServiceablePincode || Boolean(matchedOffice);

    return createPincodeResponse(
      {
        success: true,
        available,
        district: primaryOffice?.District || null,
        state: primaryOffice?.State || null,
        offices: postOffices.map((office) => office?.Name).filter(Boolean),
        message: available ? "Serviceable area" : "This pincode is not serviceable",
      }
    );
  } catch (error) {
    await logError("api/check-pincode", error).catch(console.error);
    return createPincodeResponse(
      {
        success: false,
        available: false,
        message: "Failed to check pincode. Try again later.",
      },
      500
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Check-pincode API is live",
  });
}
