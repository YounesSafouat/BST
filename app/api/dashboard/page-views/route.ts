import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PageView from '@/models/PageView';

export async function GET(req: NextRequest) {
  await dbConnect();
  const stats = await PageView.find({}).sort({ count: -1 });
  return NextResponse.json(stats);
} 