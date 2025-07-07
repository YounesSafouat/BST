import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  author: String,
  role: String,
  text: String,
  photo: String,
  createdAt: Date,
  updatedAt: Date,
}, { collection: 'testimonials' });

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

export async function GET() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find({}).lean();
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { author, role, text, photo } = body;
    if (!author || !role || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const testimonial = await Testimonial.create({
      author,
      role,
      text,
      photo: photo || null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
} 