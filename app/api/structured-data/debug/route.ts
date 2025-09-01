import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envCheck = {
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'Set' : 'Missing',
      NODE_ENV: process.env.NODE_ENV || 'Not set'
    };
    
    console.log('Environment check:', envCheck);
    
    return NextResponse.json({ 
      status: 'success', 
      environment: envCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug check failed:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        error: 'Debug check failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
