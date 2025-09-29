import mongoose, { Schema, Document } from 'mongoose';

export interface IUTM extends Document {
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
  generatedUrl: string;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

const UTMSchema = new Schema<IUTM>({
  source: {
    type: String,
    required: true,
    trim: true
  },
  medium: {
    type: String,
    required: true,
    trim: true
  },
  campaign: {
    type: String,
    required: true,
    trim: true
  },
  term: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  generatedUrl: {
    type: String,
    required: true,
    unique: true
  },
  clicks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
UTMSchema.index({ source: 1, medium: 1, campaign: 1 });
UTMSchema.index({ createdAt: -1 });

export default mongoose.models.UTM || mongoose.model<IUTM>('UTM', UTMSchema);
