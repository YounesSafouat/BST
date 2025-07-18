import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    console.log('Test contact API endpoint called')
    const body = await req.json()
    console.log('Test request body received:', body)
    
    return NextResponse.json({
      success: true,
      message: 'Test endpoint working',
      receivedData: body
    })
  } catch (error) {
    console.error("Test endpoint error:", error)
    return NextResponse.json(
      { error: "Test endpoint error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Test contact API endpoint is working'
  })
} 