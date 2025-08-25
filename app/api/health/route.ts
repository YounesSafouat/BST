import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";

export async function GET() {
  try {
    console.log('Health check: Connecting to database...');
    await connectDB();
    console.log('Health check: Database connected successfully');
    
    // Test database query
    const count = await Content.countDocuments();
    console.log('Health check: Content count:', count);
    
    return NextResponse.json({ 
      status: 'healthy', 
      database: 'connected',
      contentCount: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({ 
      status: 'unhealthy', 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 