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

export async function PUT(request: NextRequest) {
  console.log('PUT /api/content/snippets called'); // Debug log
  try {
    console.log('Connecting to database...'); // Debug log
    await connectDB();
    console.log('Database connected successfully'); // Debug log
    
    const body = await request.json();
    console.log('Received body:', body); // Debug log
    
    // Find existing snippets content or create new
    let snippetsContent = await Content.findOne({ type: 'snippets' });
    
    if (snippetsContent) {
      // Update existing
      snippetsContent.content = body.content;
      snippetsContent.title = body.title;
      snippetsContent.description = body.description;
      snippetsContent.isActive = body.isActive;
      snippetsContent.updatedAt = new Date();
    } else {
      // Create new
      snippetsContent = new Content({
        type: 'snippets',
        content: body.content,
        title: body.title,
        description: body.description,
        isActive: body.isActive,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    console.log('Saving snippetsContent:', snippetsContent); // Debug log
    await snippetsContent.save();
    
    return NextResponse.json({ success: true, data: snippetsContent });
  } catch (error) {
    console.error("Error saving snippets:", error);
    return NextResponse.json({ error: "Failed to save snippets" }, { status: 500 });
  }
}
