import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

// GET: List or filter content
export async function GET(req: NextRequest) {
  try {
    console.log("API: Starting content fetch...")
    await connectDB();
    console.log("API: Connected to database")

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    console.log("API: Request params:", { type })

    const query: any = {};
    if (type) query.type = type;
    console.log("API: Query:", query)

    const contents = await Content.find(query);
    console.log("API: Found content:", contents)

    return NextResponse.json(contents, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create new content
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("API: Creating content:", body)

    const content = await Content.create(body);
    console.log("API: Created content:", content)

    return NextResponse.json(content, {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 