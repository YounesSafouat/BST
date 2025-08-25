import mongoose, { Schema } from 'mongoose';

// Clear any existing model to force schema refresh
if (mongoose.models.ButtonClick) {
  delete mongoose.models.ButtonClick;
}

const ButtonClickSchema = new Schema({
  buttonId: { type: String, required: true },
  path: { type: String, required: true },
  count: { type: Number, default: 0 },
  lastClicked: { type: Date, default: Date.now },
  firstClicked: { type: Date, default: Date.now },
  // New fields for better analytics
  buttonText: { type: String },
  buttonType: { type: String, enum: ['whatsapp', 'phone', 'email', 'contact', 'newsletter', 'rdv', 'other'] },
  userAgent: { type: String },
  referrer: { type: String },
  ipAddress: { type: String },
  country: { type: String },
  city: { type: String },
  device: { type: String, enum: ['desktop', 'mobile', 'tablet'] },
  browser: { type: String },
  os: { type: String },
  // Time-based tracking
  clicksByDate: [{
    date: { type: Date, required: true },
    count: { type: Number, default: 1 }
  }],
  // Performance metrics
  conversionRate: { type: Number, default: 0 },
  avgTimeToClick: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Indexes for better query performance
ButtonClickSchema.index({ buttonId: 1, path: 1 });
ButtonClickSchema.index({ buttonType: 1 });
ButtonClickSchema.index({ lastClicked: -1 });
ButtonClickSchema.index({ country: 1 });
ButtonClickSchema.index({ device: 1 });
ButtonClickSchema.index({ 'clicksByDate.date': -1 });

export default mongoose.model('ButtonClick', ButtonClickSchema); 