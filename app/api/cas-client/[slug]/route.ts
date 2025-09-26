import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import CasClient from '@/models/CasClient'

export const dynamic = 'force-dynamic'

// GET: Get specific CAS client case by slug
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()
    const { slug } = params

    // Find the specific case
    const clientCase = await CasClient.findOne({ slug }).lean()
    
    if (!clientCase) {
      return NextResponse.json({ error: 'Client case not found' }, { status: 404 })
    }

    // Check if case is published (unless admin)
    if (!(clientCase as any).published) {
      // You might want to add admin authentication here
      return NextResponse.json({ error: 'Client case not found' }, { status: 404 })
    }

    return NextResponse.json(clientCase, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// PUT: Update specific CAS client case by slug
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()
    const { slug } = params
    const body = await req.json()

    // Clean up empty testimonial data
    const cleanedBody = { ...body }
    if (cleanedBody.testimonial) {
      const { quote, author } = cleanedBody.testimonial
      if (!quote || !author?.name || !author?.role || !author?.company) {
        cleanedBody.testimonial = undefined
      }
    }

    // Update with explicit $set to ensure new fields are added
    const updatedCase = await CasClient.findOneAndUpdate(
      { slug },
      { $set: cleanedBody },
      { new: true, runValidators: false, upsert: false }
    )

    if (!updatedCase) {
      return NextResponse.json({ error: 'Client case not found' }, { status: 404 })
    }

    return NextResponse.json(updatedCase, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// DELETE: Delete specific CAS client case by slug
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()
    const { slug } = params

    // Delete the case
    const deletedCase = await CasClient.findOneAndDelete({ slug })

    if (!deletedCase) {
      return NextResponse.json({ error: 'Client case not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Client case deleted successfully' }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}