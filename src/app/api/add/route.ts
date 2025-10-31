import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const data = await req.json();
  const filePath = path.join(process.cwd(), "public", "data.csv");
  const line = `${data.kanji},${data.reading},${data.meaning}\n`;

  fs.appendFileSync(filePath, line, "utf8");
  return NextResponse.json({ success: true });
}
