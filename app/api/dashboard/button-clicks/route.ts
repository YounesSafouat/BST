import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ButtonClick from '@/models/ButtonClick';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await dbConnect();
  const stats = await ButtonClick.find({}).sort({ count: -1 });
  return NextResponse.json(stats);
} 