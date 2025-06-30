import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appearance from '@/models/Appearance';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const appearance = await Appearance.findById(params.id);
    
    if (!appearance) {
      return NextResponse.json(
        { error: 'Appearance not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(appearance);
  } catch (error) {
    console.error('Error fetching appearance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appearance' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    console.log('PUT request body:', body);
    console.log('Typography fields in request:', {
      fontFamily: body.fontFamily,
      headingFontFamily: body.headingFontFamily,
      fontSize: body.fontSize,
      headingFontSize: body.headingFontSize,
      lineHeight: body.lineHeight
    });

    // If setting this appearance as active, deactivate others
    if (body.isActive) {
      await Appearance.updateMany(
        { _id: { $ne: params.id } },
        { isActive: false }
      );
    }

    const appearance = await Appearance.findByIdAndUpdate(
      params.id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    console.log('Updated appearance:', appearance);

    if (!appearance) {
      return NextResponse.json(
        { error: 'Appearance not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(appearance);
  } catch (error) {
    console.error('Error updating appearance:', error);
    return NextResponse.json(
      { error: 'Failed to update appearance' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const appearance = await Appearance.findByIdAndDelete(params.id);

    if (!appearance) {
      return NextResponse.json(
        { error: 'Appearance not found' },
        { status: 404 }
      );
    }

    // If we deleted the active appearance, activate the first available one
    if (appearance.isActive) {
      const firstAppearance = await Appearance.findOne().sort({ createdAt: 1 });
      if (firstAppearance) {
        firstAppearance.isActive = true;
        await firstAppearance.save();
      }
    }

    return NextResponse.json({ message: 'Appearance deleted successfully' });
  } catch (error) {
    console.error('Error deleting appearance:', error);
    return NextResponse.json(
      { error: 'Failed to delete appearance' },
      { status: 500 }
    );
  }
} 