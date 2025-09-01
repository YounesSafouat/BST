import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';

// Dynamic import to avoid model compilation issues
let StructuredData: any;

async function getStructuredDataModel() {
  if (!StructuredData) {
    try {
      const { default: model } = await import('@/models/StructuredData');
      StructuredData = model;
    } catch (error) {
      console.error('Error importing StructuredData model:', error);
      throw new Error('Failed to load StructuredData model');
    }
  }
  return StructuredData;
}

// GET - Fetch structured data
export async function GET() {
  try {
    await connectDB();
    const StructuredDataModel = await getStructuredDataModel();
    
    const structuredData = await StructuredDataModel.findOne({ isActive: true });
    
    if (!structuredData) {
      // Return default data if none exists
      return NextResponse.json({
        businessName: 'BlackSwan Technology',
        alternateNames: ['BlackSwan Tech', 'Agence BlackSwan'],
        description: 'Partenaire Officiel Odoo et Platinum HubSpot au Maroc. Experts en transformation digitale, implémentation et intégration ERP/CRM.',
        foundingDate: '2022',
        websiteUrl: 'https://agence-blackswan.com',
        logo: 'https://agence-blackswan.com/BSTLogo.svg',
        businessImage: '',
        address: {
          streetAddress: '123 Boulevard Mohammed V',
          addressLocality: 'Casablanca',
          addressRegion: 'Casablanca-Settat',
          postalCode: '20000',
          addressCountry: 'MA'
        },
        geo: {
          latitude: 33.5731,
          longitude: -7.5898
        },
        telephone: '+212-522-XXX-XXX',
        email: 'contact@blackswantechnology.fr',
        businessHours: {
          monday: { isOpen: true, opens: '09:00', closes: '18:00' },
          tuesday: { isOpen: true, opens: '09:00', closes: '18:00' },
          wednesday: { isOpen: true, opens: '09:00', closes: '18:00' },
          thursday: { isOpen: true, opens: '09:00', closes: '18:00' },
          friday: { isOpen: true, opens: '09:00', closes: '18:00' },
          saturday: { isOpen: false, opens: '09:00', closes: '18:00' },
          sunday: { isOpen: false, opens: '09:00', closes: '18:00' }
        },
        contactPoints: [
          {
            telephone: '+212-522-XXX-XXX',
            contactType: 'customer service',
            areaServed: 'MA',
            availableLanguage: ['French', 'Arabic', 'English'],
            hoursAvailable: {
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '18:00'
            }
          }
        ],
        socialMedia: {
          linkedin: 'https://www.linkedin.com/company/blackswan-technology',
          facebook: 'https://www.facebook.com/blackswantech',
          twitter: 'https://twitter.com/blackswantech'
        },
        serviceAreas: [
          { type: 'Country', name: 'Morocco' },
          { type: 'City', name: 'Casablanca' },
          { type: 'City', name: 'Rabat' },
          { type: 'City', name: 'Marrakech' }
        ],
        services: [
          {
            name: 'Implémentation Odoo ERP',
            description: 'Implémentation complète de solutions Odoo ERP pour entreprises marocaines',
            category: 'ERP'
          },
          {
            name: 'Intégration HubSpot CRM',
            description: 'Intégration et optimisation HubSpot CRM pour maximiser vos ventes',
            category: 'CRM'
          }
        ],
        priceRange: '€€',
        paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
        currenciesAccepted: ['EUR', 'MAD'],
        knowsAbout: [
          'Odoo ERP',
          'HubSpot CRM',
          'Transformation digitale',
          'Automatisation des processus',
          'Intégration de systèmes',
          'Formation utilisateurs'
        ],
        schemaType: 'LocalBusiness',
        pageConfigurations: {
          home: { enabled: true, schemaType: 'LocalBusiness' },
          about: { enabled: true, schemaType: 'Organization' },
          contact: { enabled: true, schemaType: 'LocalBusiness' },
          hubspot: { enabled: true, schemaType: 'Service' },
          odoo: { enabled: true, schemaType: 'Service' }
        },
        googleBusinessProfile: {
          verificationCode: '',
          isVerified: false,
          businessCategory: 'Digital Agency',
          attributes: []
        },
        isActive: true
      });
    }
    
    return NextResponse.json(structuredData);
  } catch (error) {
    console.error('Error fetching structured data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Create or update structured data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const StructuredDataModel = await getStructuredDataModel();
    const data = await request.json();
    
    console.log('Received data:', JSON.stringify(data, null, 2));
    
    // Check if structured data already exists
    const existingData = await StructuredDataModel.findOne({ isActive: true });
    
    if (existingData) {
      console.log('Updating existing data with ID:', existingData._id);
      // Update existing data
      const updatedData = await StructuredDataModel.findByIdAndUpdate(
        existingData._id,
        {
          ...data,
          updatedBy: session.user?.email || 'unknown',
          lastUpdated: new Date()
        },
        { new: true, runValidators: true }
      );
      
      console.log('Data updated successfully');
      return NextResponse.json(updatedData);
    } else {
      console.log('Creating new structured data');
      // Create new data
      const newData = new StructuredDataModel({
        ...data,
        updatedBy: session.user?.email || 'unknown'
      });
      
      const savedData = await newData.save();
      console.log('Data created successfully with ID:', savedData._id);
      return NextResponse.json(savedData);
    }
  } catch (error) {
    console.error('Error saving structured data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Update specific fields
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const StructuredDataModel = await getStructuredDataModel();
    const data = await request.json();
    
    const existingData = await StructuredDataModel.findOne({ isActive: true });
    
    if (!existingData) {
      return NextResponse.json(
        { error: 'No structured data found' },
        { status: 404 }
      );
    }
    
    const updatedData = await StructuredDataModel.findByIdAndUpdate(
      existingData._id,
      {
        ...data,
        updatedBy: session.user?.email || 'unknown',
        lastUpdated: new Date()
      },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Error updating structured data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - Deactivate structured data
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const StructuredDataModel = await getStructuredDataModel();
    
    const result = await StructuredDataModel.updateMany(
      { isActive: true },
      { 
        isActive: false,
        updatedBy: session.user?.email || 'unknown',
        lastUpdated: new Date()
      }
    );
    
    return NextResponse.json({ 
      message: 'Structured data deactivated successfully',
      affected: result.modifiedCount
    });
  } catch (error) {
    console.error('Error deactivating structured data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
