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
        firstname: contactData.firstname || '',
        lastname: contactData.lastname || '',
        phone: contactData.phone || '',
        company: contactData.company || ''
      };

      // Add custom properties
      if (contactData.brief_description) {
        properties.brief_description = contactData.brief_description;
        console.log('Adding brief_description to HubSpot properties:', contactData.brief_description);
      }

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