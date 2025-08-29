import mongoose from 'mongoose';

const contactSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false, // Changed to false for partial submissions
  },
  firstname: {
    type: String,
    required: false,
  },
  lastname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false, // Changed to false for partial submissions
    index: true, // Add index for faster lookups
  },
  phone: {
    type: String,
    required: false, // Changed to false for partial submissions
    index: true, // Add index for faster lookups
  },
  company: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: false,
  },
  // New fields for tracking submission status
  submissionStatus: {
    type: String,
    enum: ['partial', 'complete'],
    default: 'partial',
    required: true,
    index: true, // Add index for faster lookups
  },
  // Track which fields were filled
  fieldsFilled: {
    name: { type: Boolean, default: false },
    firstname: { type: Boolean, default: false },
    lastname: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    company: { type: Boolean, default: false },
    message: { type: Boolean, default: false },
  },
  // Track if sent to HubSpot
  sentToHubSpot: {
    type: Boolean,
    default: false,
  },
  // Additional tracking fields
  countryCode: String,
  countryName: String,
  source: String,
  page: String,
  userAgent: String,
  ipAddress: String,
  // Existing status field for CRM workflow
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'read', 'replied', 'closed', 'partial_lead_sent', 'archived'],
    default: 'pending',
  },
  // HubSpot integration tracking
  hubspotContactId: String,
  hubspotSyncDate: Date,
  // French behavior description for commercial team
  brief_description: String,
  
  // Comprehensive HubSpot properties for analytics and reporting
  // Website Analytics Properties
  hs_analytics_source: String,
  
  // Lead Qualification Properties
  lifecyclestage: String,
  hs_lead_status: String,
  
  // Custom Properties
  contact_status: String,
  submission_count: String,
  first_submission_date: String,
  last_submission_date: String,
  
  // Geographic Properties
  country: String,
  hs_country_region_code: String,
  city: String,
  state: String,
  hs_state_code: String,
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Remove the problematic unique indexes that prevent users from having both email and phone
// Instead, use a more logical approach - no unique constraints that would prevent merging
// We'll handle duplicates in the application logic instead

// Update the updatedAt timestamp before saving
contactSubmissionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Remove the model from the cache if it exists
if (mongoose.models.ContactSubmission) {
  delete mongoose.models.ContactSubmission;
}

export default mongoose.model('ContactSubmission', contactSubmissionSchema); 