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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const testimonial = await Testimonial.findById(params.id).lean();
    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonial' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { author, role, text, photo } = body;
    if (!author || !role || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const result = await Testimonial.findByIdAndUpdate(
      params.id,
      {
        author,
        role,
        text,
        photo: photo || null,
        updatedAt: new Date()
      },
      { new: true }
    );
    if (!result) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const result = await Testimonial.findByIdAndDelete(params.id);
    if (!result) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
} 