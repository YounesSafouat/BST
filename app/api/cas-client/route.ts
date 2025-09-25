import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import CasClient from '@/models/CasClient'
import { ClientCaseFilters } from '@/lib/types/cas-client'

export const dynamic = 'force-dynamic'

// GET: Get all CAS client cases with filtering and pagination
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(req.url)
    const filters: ClientCaseFilters = {
      search: searchParams.get('search') || '',
      solution: (searchParams.get('solution') as any) || 'all',
      sector: searchParams.get('sector') || 'all',
      tags: searchParams.get('tags')?.split(',') || [],
      featured: searchParams.get('featured') === 'true',
      published: searchParams.get('published') !== 'false', // default to true
      sortBy: (searchParams.get('sortBy') as any) || 'newest'
    }

    // Build MongoDB query
    let query: any = {}

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { headline: { $regex: searchTerm, $options: 'i' } },
        { summary: { $regex: searchTerm, $options: 'i' } },
        { 'company.sector': { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ]
    }

    if (filters.solution && filters.solution !== 'all') {
      query['project.solution'] = filters.solution
    }

    if (filters.sector && filters.sector !== 'all') {
      query['company.sector'] = filters.sector
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags }
    }

    if (filters.featured) {
      query.featured = true
    }

    if (filters.published !== undefined) {
      query.published = filters.published
    }

    // Build sort object
    let sort: any = {}
    switch (filters.sortBy) {
      case 'newest':
        sort.createdAt = -1
        break
      case 'oldest':
        sort.createdAt = 1
        break
      case 'name':
        sort.name = 1
        break
      case 'featured':
        sort.featured = -1
        sort.createdAt = -1
        break
      default:
        sort.createdAt = -1
    }

    // Pagination
    const pageNum = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (pageNum - 1) * limit

    // Execute query
    const [cases, total] = await Promise.all([
      CasClient.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      CasClient.countDocuments(query)
    ])

    return NextResponse.json({
      cases,
      total,
      page: pageNum,
      limit,
      filters
    }, {
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

// POST: Create new CAS client case
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    
    // Debug: Log the received body (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('API received body:', JSON.stringify(body, null, 2))
    }
    
    // Validate required fields
    const missingFields: string[] = []
    if (!body.slug) missingFields.push('slug')
    if (!body.name) missingFields.push('name')
    if (!body.headline) missingFields.push('headline')
    if (!body.summary) missingFields.push('summary')
    if (!body.company?.logo) missingFields.push('company.logo')
    if (!body.company?.sector) missingFields.push('company.sector')
    if (!body.company?.size) missingFields.push('company.size')
    if (!body.project?.solution) missingFields.push('project.solution')
    if (!body.project?.duration) missingFields.push('project.duration')
    if (!body.project?.teamSize) missingFields.push('project.teamSize')
    if (!body.media?.coverImage) missingFields.push('media.coverImage')

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      console.error('Received body:', JSON.stringify(body, null, 2))
      return NextResponse.json({ 
        error: 'Missing required fields', 
        missingFields: missingFields 
      }, { status: 400 })
    }

    // Check if slug already exists
    const existingClient = await CasClient.findOne({ slug: body.slug })
    if (existingClient) {
      return NextResponse.json({ error: 'Client with this slug already exists' }, { status: 400 })
    }

    // Clean up empty testimonial data
    const cleanedBody = { ...body }
    if (cleanedBody.testimonial) {
      const { quote, author } = cleanedBody.testimonial
      if (!quote || !author?.name || !author?.role || !author?.company) {
        cleanedBody.testimonial = undefined
      } else {
        // Clean up empty avatar string
        if (cleanedBody.testimonial.author.avatar === '') {
          cleanedBody.testimonial.author.avatar = undefined
        }
      }
    }

    // Create new client case
    const newClient = new CasClient({
      ...cleanedBody,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: cleanedBody.published ? new Date() : undefined
    })

    // Debug: Log save attempt (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('Attempting to save client with data:', JSON.stringify(cleanedBody, null, 2))
    }
    
    try {
      const savedClient = await newClient.save()
      if (process.env.NODE_ENV === 'development') {
        console.log('Client saved successfully:', savedClient._id)
      }
      return NextResponse.json(savedClient, {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    } catch (saveError: any) {
      console.error('Mongoose save error:', saveError)
      console.error('Validation errors:', saveError.errors)
      return NextResponse.json({ 
        error: 'Validation error', 
        details: saveError.message,
        validationErrors: saveError.errors 
      }, { status: 400 })
    }
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}