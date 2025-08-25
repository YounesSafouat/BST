import mongoose, { Schema } from 'mongoose';

// Clear any existing model to force schema refresh
if (mongoose.models.PageView) {
  delete mongoose.models.PageView;
}

const PageViewSchema = new Schema({
  path: { type: String, required: true },
  page: { type: String, required: true },
  count: { type: Number, default: 0 },
  lastViewed: { type: Date, default: Date.now },
  firstViewed: { type: Date, default: Date.now },
  // New fields for better analytics
  userAgent: { type: String },
  referrer: { type: String },
  ipAddress: { type: String },
  country: { type: String },
  city: { type: String },
  device: { type: String, enum: ['desktop', 'mobile', 'tablet'] },
  browser: { type: String },
  os: { type: String },
  // Time-based tracking
  viewsByDate: [{
    date: { type: Date, required: true },
    count: { type: Number, default: 1 }
  }],
  // Performance metrics
  avgTimeOnPage: { type: Number, default: 0 },
  bounceRate: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Indexes for better query performance
PageViewSchema.index({ path: 1, lastViewed: -1 });
PageViewSchema.index({ lastViewed: -1 });
PageViewSchema.index({ country: 1 });
PageViewSchema.index({ device: 1 });
PageViewSchema.index({ 'viewsByDate.date': -1 });

export default mongoose.model('PageView', PageViewSchema); 