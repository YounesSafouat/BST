import mongoose, { Schema } from 'mongoose';

// Clear any existing model to force schema refresh
if (mongoose.models.ButtonClick) {
  delete mongoose.models.ButtonClick;
}

const ButtonClickSchema = new Schema({
  buttonId: { type: String, required: true },
  path: { type: String, required: true },
  count: { type: Number, default: 0 },
});

ButtonClickSchema.index({ buttonId: 1, path: 1 }, { unique: true });

export default mongoose.model('ButtonClick', ButtonClickSchema); 