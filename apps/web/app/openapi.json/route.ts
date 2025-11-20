import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

// Serve the OpenAPI spec at /openapi.json so links in README work
export async function GET() {
  try {
    const specPath = path.join(process.cwd(), "..", "..", "openapi.json");
    const json = await fs.readFile(specPath, "utf8");
    return new NextResponse(json, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "OpenAPI spec not found", details: err?.message ?? String(err) },
      { status: 404 },
    );
  }
}
