import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

const TestimonialSchema = new mongoose.Schema({
  author: String,
  role: String,
  text: String,
  photo: String,
  // Add region targeting
  targetRegions: {
    type: [String],
    default: ['all'], // 'all', 'france', 'morocco', 'international'
    enum: ['all', 'france', 'morocco', 'international']
  },
  // Client case path (e.g., '/allisone')
  clientCasePath: {
    type: String,
    default: null
  },
  createdAt: Date,
  updatedAt: Date,
}, { collection: 'testimonials', strict: false });

// Delete cached model to ensure schema updates are applied
if (mongoose.models.Testimonial) {
  delete mongoose.models.Testimonial;
}

const Testimonial = mongoose.model('Testimonial', TestimonialSchema);

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if region filtering is requested
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    
    console.log('🔍 Testimonials API - Region requested:', region);
    
    let query = {};
    if (region && region !== 'all') {
      query = {
        $or: [
          { targetRegions: 'all' },
          { targetRegions: { $in: [region] } }
        ]
      };
      console.log('🔍 Testimonials API - Query filter:', JSON.stringify(query));
    } else {
      console.log('🔍 Testimonials API - No region filter, showing all testimonials');
    }
    
    const testimonials = await Testimonial.find(query).lean();
    console.log('🔍 Testimonials API - Found testimonials:', testimonials.length);
    console.log('🔍 Testimonials API - Testimonials regions:', testimonials.map(t => ({ author: t.author, targetRegions: t.targetRegions })));
    
    // Debug: Check if testimonials actually match the region filter
    let filteredTestimonials = testimonials;
    if (region && region !== 'all') {
      filteredTestimonials = testimonials.filter(t => 
        t.targetRegions?.includes(region) || t.targetRegions?.includes('all')
      );
      console.log('🔍 Testimonials API - Matching testimonials for region', region, ':', filteredTestimonials.length);
      console.log('🔍 Testimonials API - Matching testimonials details:', filteredTestimonials.map(t => ({ author: t.author, targetRegions: t.targetRegions })));
    }
    
    return NextResponse.json(filteredTestimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { author, role, text, photo, targetRegions, clientCasePath } = body;
    
    if (!author || !role || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const testimonial = await Testimonial.create({
      author,
      role,
      text,
      photo: photo || null,
      targetRegions: targetRegions || ['all'],
      clientCasePath: clientCasePath || null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
} 