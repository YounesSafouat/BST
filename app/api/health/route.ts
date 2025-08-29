import { NextResponse } from "next/server"
import connectDB from '@/lib/mongodb'
import ContactSubmission from '@/models/ContactSubmission'

export async function GET() {
  try {
    console.log('Health check endpoint called')
    
    // Test database connection
    await connectDB()
    console.log('Database connection successful')
    
    // Test if we can query the ContactSubmission model
    const count = await ContactSubmission.countDocuments()
    console.log(`ContactSubmission count: ${count}`)
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      contactSubmissions: count,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 