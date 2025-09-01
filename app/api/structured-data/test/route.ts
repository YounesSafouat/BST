import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing database connection...');
    await connectDB();
    console.log('Database connected successfully');
    
    // Test basic MongoDB operations
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await client.close();
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connection test passed',
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        error: 'Database test failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
