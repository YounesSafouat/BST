import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PageView from '@/models/PageView';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { path } = await req.json();
  await PageView.findOneAndUpdate(
    { path },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
  return NextResponse.json({ success: true });
} 