import mongoose, { Schema } from 'mongoose';

// Clear any existing model to force schema refresh
if (mongoose.models.PageView) {
  delete mongoose.models.PageView;
}

const PageViewSchema = new Schema({
  path: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

export default mongoose.model('PageView', PageViewSchema); 