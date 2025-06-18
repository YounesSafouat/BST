import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'User deleted' });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;
  const data = await req.json();
  const update: any = {};
  if (data.name) update.name = data.name;
  if (data.email) update.email = data.email;
  if (data.role) update.role = data.role;
  if (data.password) update.password = await bcrypt.hash(data.password, 12);
  const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'User updated', user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
} 