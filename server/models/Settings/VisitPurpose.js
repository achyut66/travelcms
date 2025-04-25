import mongoose from 'mongoose';

const visitPurposeSchema = new mongoose.Schema({
  purpose: { type: String, required: true },
  
},{ timestamps: true });

const visitPurposeSettings = mongoose.model('settings_visit_purpose', visitPurposeSchema);
export default visitPurposeSettings;
