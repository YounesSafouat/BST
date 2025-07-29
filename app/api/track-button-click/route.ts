import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ButtonClick from '@/models/ButtonClick';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { buttonId, path } = await req.json();
  await ButtonClick.findOneAndUpdate(
    { buttonId, path },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
  return NextResponse.json({ success: true });
} 