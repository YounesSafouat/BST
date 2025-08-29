import { Client } from '@hubspot/api-client';

// Debug: Check if environment variable is available
console.log('HubSpot Access Token available:', !!process.env.HUBSPOT_ACCESS_TOKEN);
if (!process.env.HUBSPOT_ACCESS_TOKEN) {
  console.error('HUBSPOT_ACCESS_TOKEN environment variable is not set!');
}

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

export interface ContactData {
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  company?: string;
  message?: string;
  brief_description?: string; // Add explicit brief_description field
  [key: string]: any; // For additional custom properties
}

export class HubSpotService {
  /**
   * Create or update a contact in HubSpot
   * If contact exists, it will update the contact and increment submission count
   */
  static async upsertContact(contactData: ContactData) {
    try {
      // First, try to find existing contact by email
      const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ' as any,
                value: contactData.email
              }
            ]
          }
        ],
        properties: ['email', 'firstname', 'lastname', 'phone', 'company', 'submission_count', 'last_submission_date', 'contact_status'],
        limit: 1
      });

      const existingContact = searchResponse.results[0];

      // Prepare properties - start with standard HubSpot properties
      const properties: any = {
        email: contactData.email,
        firstname: contactData.lastname || '',
        lastname: contactData.lastname || '',
        phone: contactData.phone || '',
        company: contactData.company || '',
        message: contactData.message || '',
        
        // Website Analytics Properties
        hs_analytics_source: contactData.hs_analytics_source || 'WEBSITE_FORM',
        hs_analytics_source_data_1: contactData.hs_analytics_source_data_1 || 'contact_form',
        hs_analytics_source_data_2: contactData.hs_analytics_source_data_2 || 'website',
        hs_analytics_first_timestamp: contactData.hs_analytics_first_timestamp || new Date().toISOString(),
        hs_analytics_first_visit_timestamp: contactData.hs_analytics_first_visit_timestamp || new Date().toISOString(),
        hs_analytics_first_url: contactData.hs_analytics_first_url || '',
        hs_analytics_first_referrer: contactData.hs_analytics_first_referrer || '',
        hs_analytics_last_timestamp: contactData.hs_analytics_last_timestamp || new Date().toISOString(),
        hs_analytics_last_url: contactData.hs_analytics_last_url || '',
        hs_analytics_last_referrer: contactData.hs_analytics_last_referrer || '',
        hs_analytics_num_visits: contactData.hs_analytics_num_visits || 1,
        hs_analytics_num_page_views: contactData.hs_analytics_num_page_views || 1,
        hs_analytics_num_event_completions: contactData.hs_analytics_num_event_completions || 1,
        hs_analytics_average_page_views: contactData.hs_analytics_average_page_views || 1,
        
        // Lead Qualification Properties
        lifecyclestage: contactData.lifecyclestage || 'lead',
        hs_lead_status: contactData.hs_lead_status || 'NEW',
        hs_predictivecontactscore_v2: contactData.hs_predictivecontactscore_v2 || 50,
        hs_predictivescoringtier: contactData.hs_predictivescoringtier || 'tier_3',
        hs_time_to_first_engagement: contactData.hs_time_to_first_engagement || 0,
        
        // Conversion Tracking
        first_conversion_date: contactData.first_conversion_date || new Date().toISOString().split('T')[0],
        first_conversion_event_name: contactData.first_conversion_event_name || 'Contact Form Submission',
        recent_conversion_date: contactData.recent_conversion_date || new Date().toISOString().split('T')[0],
        recent_conversion_event_name: contactData.recent_conversion_event_name || 'Contact Form Submission',
        num_conversion_events: contactData.num_conversion_events || 1,
        num_unique_conversion_events: contactData.num_unique_conversion_events || 1,
        
        // Geographic & IP Data
        country: contactData.country || '',
        hs_country_region_code: contactData.hs_country_region_code || '',
        city: contactData.city || '',
        state: contactData.state || '',
        hs_state_code: contactData.hs_state_code || '',
        ip_country: contactData.ip_country || '',
        ip_country_code: contactData.ip_country_code || '',
        ip_city: contactData.ip_city || '',
        ip_state: contactData.ip_state || '',
        ip_state_code: contactData.ip_state_code || '',
        hs_ip_timezone: contactData.hs_ip_timezone || '',
        hs_timezone: contactData.hs_timezone || '',
        
        // Company Information
        industry: contactData.industry || '',
        numemployees: contactData.numemployees || '',
        annualrevenue: contactData.annualrevenue || '',
        website: contactData.website || '',
        jobtitle: contactData.jobtitle || '',
        hs_role: contactData.hs_role || '',
        hs_seniority: contactData.hs_seniority || '',
        
        // Sales Intelligence
        hs_buying_role: contactData.hs_buying_role || 'DECISION_MAKER',
        hs_sa_first_engagement_date: contactData.hs_sa_first_engagement_date || new Date().toISOString(),
        hs_sa_first_engagement_descr: contactData.hs_sa_first_engagement_descr || 'FORM_SUBMISSION',
        hs_sa_first_engagement_object_type: contactData.hs_sa_first_engagement_object_type || 'FORM',
        num_associated_deals: contactData.num_associated_deals || 0,
        total_revenue: contactData.total_revenue || 0,
        
        // Engagement & Activity
        hs_last_sales_activity_timestamp: contactData.hs_last_sales_activity_timestamp || new Date().toISOString(),
        notes_last_contacted: contactData.notes_last_contacted || new Date().toISOString(),
        notes_last_updated: contactData.notes_last_updated || new Date().toISOString(),
        num_contacted_notes: contactData.num_contacted_notes || 0,
        num_notes: contactData.num_notes || 0,
        
        // Email Marketing
        hs_email_domain: contactData.hs_email_domain || contactData.email?.split('@')[1] || '',
        hs_email_open: contactData.hs_email_open || 0,
        hs_email_click: contactData.hs_email_click || 0,
        hs_email_delivered: contactData.hs_email_delivered || 0,
        hs_email_bounce: contactData.hs_email_bounce || 0,
        hs_email_optout: contactData.hs_email_optout || false,
        
        // Custom Properties
        contact_status: contactData.contact_status || 'new lead',
        source: contactData.source || 'website_contact_form',
        page: contactData.page || '',
        submission_count: contactData.submission_count || '1',
        first_submission_date: contactData.first_submission_date || new Date().toISOString().split('T')[0],
        last_submission_date: contactData.last_submission_date || new Date().toISOString().split('T')[0],
        
        // Brief description for sales team
        brief_description: contactData.brief_description || ''
      };

      console.log('Final HubSpot properties being sent:', properties);

      // Add message as a note or custom property if needed
      if (contactData.message) {
        // Store the message in the company field if it's not too long, otherwise in a note
        if (contactData.message.length <= 100) {
          properties.company = contactData.company || contactData.message;
        } else {
          // For longer messages, we'll need to create a note or use a custom property
          console.log('Message content (long):', contactData.message);
          // You can create a custom property called 'message' in HubSpot if needed
        }
      }

      if (existingContact) {
        // Contact exists - update with new information and increment submission count
        const currentSubmissionCount = existingContact.properties.submission_count || '0';
        const newSubmissionCount = parseInt(currentSubmissionCount) + 1;

        // Add tracking properties (only the ones that exist in HubSpot)
        properties.submission_count = newSubmissionCount.toString();
        properties.last_submission_date = new Date().toISOString().split('T')[0]; // Date only, no time
        
        // Check if this is a partial lead (has message indicating partial status)
        if (contactData.message && contactData.message.includes('Partial lead')) {
          properties.contact_status = 'partial lead';
        } else {
          properties.contact_status = 're engaged';
        }

        console.log('Updating existing contact with properties:', properties);

        const updateResponse = await hubspotClient.crm.contacts.basicApi.update(existingContact.id, {
          properties
        });

        console.log('Contact updated in HubSpot:', updateResponse);
        console.log('Updated contact properties:', updateResponse.properties);
        return { success: true, action: 'updated', contactId: existingContact.id };
      } else {
        // New contact - create with initial values
        // Add tracking properties (only the ones that exist in HubSpot)
        properties.submission_count = '1';
        properties.first_submission_date = new Date().toISOString().split('T')[0]; // Date only, no time
        properties.last_submission_date = new Date().toISOString().split('T')[0]; // Date only, no time
        
        // Check if this is a partial lead
        if (contactData.message && contactData.message.includes('Partial lead')) {
          properties.contact_status = 'partial lead';
        } else {
          properties.contact_status = 'new lead';
        }

        console.log('Creating new contact with properties:', properties);

        const createResponse = await hubspotClient.crm.contacts.basicApi.create({
          properties
        });

        console.log('Contact created in HubSpot:', createResponse);
        console.log('Created contact properties:', createResponse.properties);
        return { success: true, action: 'created', contactId: createResponse.id };
      }
    } catch (error) {
      console.error('HubSpot API Error:', error);
      throw new Error(`Failed to upsert contact in HubSpot: ${error}`);
    }
  }

  /**
   * Get contact by email
   */
  static async getContactByEmail(email: string) {
    try {
      const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ' as any,
                value: email
              }
            ]
          }
        ],
        properties: ['email', 'firstname', 'lastname', 'phone', 'company', 'submission_count', 'first_submission_date', 'last_submission_date', 'contact_status'],
        limit: 1
      });

      return searchResponse.results[0] || null;
    } catch (error) {
      console.error('HubSpot API Error:', error);
      throw new Error(`Failed to get contact from HubSpot: ${error}`);
    }
  }
} 