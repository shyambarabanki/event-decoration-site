import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { NextResponse } from "next/server";

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

export async function GET(_req, { params }) {
  const { type } = await params;

  const normalizedType = normalize(type);
  const filePath = path.resolve(process.cwd(), "data", "designs.xlsx");

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: `Excel file not found at ${filePath}` },
      { status: 404 }
    );
  }

  try {
    const buffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return NextResponse.json([]);
    }

    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const designs = rows
      .map((row, index) => ({
        id: row.id || row.ID || String(index + 1),
        name: row.name || row.Name || "",
        image: row.image || row.Image || "",
        price: row.price || row.Price || "",
        description: row.description || row.Description || "",
        age: row.age || row.Age || "",
        gender: row.gender || row.Gender || "all",
        theme: row.theme || row.Theme || "",
        type: row.type || row.Type || "",
      }))
      .filter((d) => normalize(d.type) === normalizedType);

    return NextResponse.json(designs);
  } catch (error) {
    console.error("Excel read error:", error);
    return NextResponse.json(
      { error: "Failed to read Excel file" },
      { status: 500 }
    );
  }
}