import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ButtonClick from '@/models/ButtonClick';
import { detectTrafficSource } from '@/lib/traffic-source-detector';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  return NextResponse.json({ success: true });
} 