import mongoose from 'mongoose';

const inclusionSchema = new mongoose.Schema({
  items_name: { type: String, required: true },
  
},{ timestamps: true });

const inclusionSettings = mongoose.model('settings_inclusions', inclusionSchema);
export default inclusionSettings;
