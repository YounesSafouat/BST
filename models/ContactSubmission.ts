import mongoose from 'mongoose';

const contactSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false, // Changed to false for partial submissions
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
    enum: ['pending', 'read', 'replied', 'closed', 'partial_lead_sent'],
    default: 'pending',
  },
  // HubSpot integration tracking
  hubspotContactId: String,
  hubspotSyncDate: Date,
  // French behavior description for commercial team
  brief_description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add compound indexes to prevent duplicates
contactSubmissionSchema.index({ email: 1, submissionStatus: 1 }, { unique: true, sparse: true });
contactSubmissionSchema.index({ phone: 1, submissionStatus: 1 }, { unique: true, sparse: true });

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