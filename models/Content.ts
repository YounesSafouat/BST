import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: false },
  metadata: {
    color: String,
    image: String,
    order: Number,
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { strict: false }); // Allow any root fields

contentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

if (mongoose.models.Content) {
  delete mongoose.models.Content;
}
export default mongoose.model('Content', contentSchema);