import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Partial contact API is working!",
    endpoint: "/api/contact/partial",
    method: "POST",
    example: {
      email: "test@example.com",
      countryCode: "MA",
      countryName: "Maroc",
      source: "test",
      page: "test"
    }
  })
}
