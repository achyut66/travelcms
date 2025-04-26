import mongoose from 'mongoose';

const transportationSchema = new mongoose.Schema({
  vehicle_type: { type: String, required: true },
  vehicle_number: { type: String },
  
},{ timestamps: true });

const transportationSettings = mongoose.model('settings_transportation', transportationSchema);
export default transportationSettings;
