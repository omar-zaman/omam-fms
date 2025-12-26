import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  await connectToDatabase();
  return NextResponse.json({ status: "OK", message: "Server is running" });
}
