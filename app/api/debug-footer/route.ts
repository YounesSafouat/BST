import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log("DEBUG: Starting footer debug...")
    await connectDB();
    console.log("DEBUG: Connected to database")

    // Test 1: Find all content
    const allContent = await Content.find({});
    console.log("DEBUG: All content count:", allContent.length)
    console.log("DEBUG: All content types:", allContent.map(c => c.type))

    // Test 2: Find footer specifically
    const footerContent = await Content.find({ type: 'footer' });
    console.log("DEBUG: Footer content count:", footerContent.length)
    
    if (footerContent.length > 0) {
      console.log("DEBUG: Footer content found:", {
        id: footerContent[0]._id,
        type: footerContent[0].type,
        hasContent: !!footerContent[0].content,
        contentKeys: footerContent[0].content ? Object.keys(footerContent[0].content) : []
      })
    }

    // Test 3: Find by ObjectId if we have it
    const testId = "6862bfa4ca76e2743e6293db";
    const byId = await Content.findById(testId);
    console.log("DEBUG: Content by ID found:", !!byId)

    return NextResponse.json({
      allContentCount: allContent.length,
      allContentTypes: allContent.map(c => c.type),
      footerContentCount: footerContent.length,
      footerContent: footerContent.length > 0 ? footerContent[0] : null,
      byIdFound: !!byId
    });
  } catch (error: any) {
    console.error('DEBUG Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 