import mongoose from 'mongoose';

const contactSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['pending', 'read', 'replied', 'closed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

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