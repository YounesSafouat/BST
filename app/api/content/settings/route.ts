import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    // Try to find existing settings
    let settings = await Content.findOne({ type: 'settings' });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await Content.create({
        type: 'settings',
        title: 'Site Settings',
        description: 'Global site settings',
        content: {
          siteTitle: 'BlackSwan Technology',
          siteDescription: 'Partenaire Officiel Odoo au Maroc',
          visualEffects: {
            showCurvedLines: true
          },
          pageVisibility: {
            home: true,
            blog: true,
            hubspot: true,
            about: true,
            casClient: true,
            contact: true
          },
          regionalContact: {
            france: {
              phone: '+33 1 23 45 67 89',
              email: 'contact@blackswantechnology.fr',
              address: '123 Avenue des Champs-Élysées, 75008 Paris, France',
              whatsapp: '+33 1 23 45 67 89'
            },
            morocco: {
              phone: '+212 522 123 456',
              email: 'contact@blackswantechnology.ma',
              address: '123 Boulevard Mohammed V, Casablanca, Maroc',
              whatsapp: '+212 522 123 456'
            },
            other: {
              phone: '+212 522 123 456',
              email: 'contact@blackswantechnology.com',
              address: '123 Boulevard Mohammed V, Casablanca, Maroc',
              whatsapp: '+212 522 123 456'
            }
          }
        },
        isActive: true,
        metadata: { order: 1 }
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    
    // Update or create settings
    const settings = await Content.findOneAndUpdate(
      { type: 'settings' },
      {
        type: 'settings',
        title: body.title || 'Site Settings',
        description: body.description || 'Global site settings',
        content: body.content,
        isActive: body.isActive !== undefined ? body.isActive : true,
        metadata: body.metadata || { order: 1 },
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true 
      }
    );
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}