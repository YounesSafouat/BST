import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Content from "@/models/Content";

export async function GET() {
  try {
    await connectDB();
    
    const snippetsContent = await Content.findOne({ type: 'snippets' });
    
    if (!snippetsContent) {
      return NextResponse.json([]);
    }
    
    return NextResponse.json([snippetsContent]);
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
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
    
    await snippetsContent.save();
    
    return NextResponse.json({ success: true, data: snippetsContent });
  } catch (error) {
    console.error("Error saving snippets:", error);
    return NextResponse.json({ error: "Failed to save snippets" }, { status: 500 });
  }
}
