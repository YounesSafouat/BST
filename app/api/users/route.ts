import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');
  const filter = searchParams.get('filter');

  const query: any = {};
  if (role) query.role = role;
  if (filter) {
    query.$or = [
      { name: { $regex: filter, $options: 'i' } },
      { email: { $regex: filter, $options: 'i' } }
    ];
  }

  const users = await User.find(query, '-password'); // Exclude password
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { name, email, password, role } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword, role });
  return NextResponse.json({ message: 'User created', user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
} 