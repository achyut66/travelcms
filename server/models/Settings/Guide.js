import mongoose from 'mongoose';

const guideSchema = new mongoose.Schema({
  contact_name: { type: String, required: true },
  flag: { type: String, required: true },
  
},{ timestamps: true });

const guideSettings = mongoose.model('settings_guide_potter', guideSchema);
export default guideSettings;
