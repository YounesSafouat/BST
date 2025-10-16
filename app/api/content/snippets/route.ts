import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";

export async function GET() {
  console.log('GET /api/content/snippets called'); // Debug log
  try {
    console.log('Connecting to database...'); // Debug log
    await connectDB();
    console.log('Database connected successfully'); // Debug log
    
    console.log('Searching for snippets content...'); // Debug log
    const snippetsContent = await Content.findOne({ type: 'snippets' });
    console.log('Database query result:', snippetsContent); // Debug log
    
    if (!snippetsContent) {
      console.log('No snippets content found, returning empty array'); // Debug log
      return NextResponse.json([]);
    }
    
    console.log('Returning snippets content:', snippetsContent); // Debug log
    return NextResponse.json([snippetsContent]);
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('POST /api/content/snippets called'); // Debug log
  try {
    console.log('Connecting to database...'); // Debug log
    await connectDB();
    console.log('Database connected successfully'); // Debug log
    
    const body = await request.json();
    console.log('Received body:', JSON.stringify(body, null, 2)); // Debug log
    
    // Validate body
    if (!body || !body.content) {
      console.error('Invalid request body - missing content');
      return NextResponse.json({ 
        error: "Invalid request body", 
        details: "Content is required" 
      }, { status: 400 });
    }
    
    // Find existing snippets content or create new
    let snippetsContent = await Content.findOne({ type: 'snippets' });
    console.log('Existing snippets content:', snippetsContent ? 'Found' : 'Not found');
    
    if (snippetsContent) {
      // Update existing
      console.log('Updating existing snippets...');
      snippetsContent.content = body.content;
      snippetsContent.title = body.title || 'Snippets Configuration';
      snippetsContent.description = body.description || 'Meta tags, tracking codes, and custom scripts';
      snippetsContent.isActive = body.isActive !== undefined ? body.isActive : true;
      snippetsContent.updatedAt = new Date();
    } else {
      // Create new
      console.log('Creating new snippets document...');
      snippetsContent = new Content({
        type: 'snippets',
        content: body.content,
        title: body.title || 'Snippets Configuration',
        description: body.description || 'Meta tags, tracking codes, and custom scripts',
        isActive: body.isActive !== undefined ? body.isActive : true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    console.log('Saving snippetsContent with content:', JSON.stringify(snippetsContent.content, null, 2)); // Debug log
    const savedContent = await snippetsContent.save();
    console.log('Successfully saved snippets. ID:', savedContent._id);
    
    return NextResponse.json({ success: true, data: savedContent });
  } catch (error) {
    console.error("Error saving snippets:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json({ 
      error: "Failed to save snippets", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  console.log('PUT /api/content/snippets called'); // Debug log
  // Redirect PUT to POST for compatibility
  return POST(request);
}
