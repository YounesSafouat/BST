import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactSubmission from '@/models/ContactSubmission';

export const dynamic = 'force-dynamic';

// GET: Export leads to CSV
export async function GET(req: NextRequest) {
  try {
    console.log('Leads Export API: Starting CSV export...');
    await connectDB();
    console.log('Leads Export API: Connected to database');

    const { searchParams } = new URL(req.url);
    
    // Get filter parameters
    const searchTerm = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status') || 'all';
    const hubspotFilter = searchParams.get('hubspot') || 'all';
    const submissionFilter = searchParams.get('submission') || 'all';
    const countryFilter = searchParams.get('country') || 'all';

    console.log('Leads Export API: Filter parameters:', {
      searchTerm,
      statusFilter,
      hubspotFilter,
      submissionFilter,
      countryFilter
    });

    // Build query based on filters
    let query: any = {};

    // Status filter
    if (statusFilter !== 'all') {
      query.status = statusFilter;
    }

    // HubSpot filter
    if (hubspotFilter !== 'all') {
      if (hubspotFilter === 'sent') {
        query.sentToHubSpot = true;
      } else if (hubspotFilter === 'not-sent') {
        query.sentToHubSpot = false;
      }
    }

    // Submission status filter
    if (submissionFilter !== 'all') {
      query.submissionStatus = submissionFilter;
    }

    // Country filter
    if (countryFilter !== 'all') {
      query.countryCode = countryFilter;
    }

    console.log('Leads Export API: MongoDB query:', query);

    // Fetch leads from database
    let leads = await ContactSubmission.find(query).sort({ createdAt: -1 });

    // Apply search filter if provided
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      leads = leads.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.lastname?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    console.log('Leads Export API: Found leads:', leads.length);

    // Generate CSV content
    const csvHeaders = [
      'ID',
      'Date de création',
      'Nom complet',
      'Prénom',
      'Nom de famille',
      'Email',
      'Téléphone',
      'Entreprise',
      'Message',
      'Type de soumission',
      'Statut commercial',
      'Envoyé à HubSpot',
      'ID HubSpot',
      'Date de synchronisation HubSpot',
      'Code pays',
      'Nom du pays',
      'Source',
      'Page',
      'Description comportementale'
    ];

    const csvRows = leads.map(lead => [
      lead._id,
      new Date(lead.createdAt).toLocaleDateString('fr-FR'),
      lead.name || '',
      lead.firstname || '',
      lead.lastname || '',
      lead.email || '',
      lead.phone || '',
      lead.company || '',
      lead.message || '',
      lead.submissionStatus === 'partial' ? 'Partiel' : 'Complet',
      lead.status || '',
      lead.sentToHubSpot ? 'Oui' : 'Non',
      lead.hubspotContactId || '',
      lead.hubspotSyncDate ? new Date(lead.hubspotSyncDate).toLocaleDateString('fr-FR') : '',
      lead.countryCode || '',
      lead.countryName || '',
      lead.source || '',
      lead.page || '',
      lead.brief_description || ''
    ]);

    // Combine headers and rows
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => {
        // Escape fields that contain commas, quotes, or newlines
        if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
          return `"${field.replace(/"/g, '""')}"`;
        }
        return field;
      }).join(','))
      .join('\n');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `leads_export_${timestamp}.csv`;

    console.log('Leads Export API: CSV generated successfully');

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error: any) {
    console.error('Leads Export API Error:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'export CSV', 
      success: false 
    }, { status: 500 });
  }
}
