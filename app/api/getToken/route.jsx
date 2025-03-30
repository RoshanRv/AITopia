import { NextResponse } from "next/server";

export async function GET(req) {
  const token = process.env.REVERIE_API_KEY; // Use your Reverie API key environment variable
  console.log("Reverie API Token:", token);
  return NextResponse.json(token);
}
