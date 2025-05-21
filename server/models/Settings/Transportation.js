import mongoose from 'mongoose';

const transportationSchema = new mongoose.Schema({
  company_name: {type:String, required: true},
  vehicle_type: { type: String, required: true },
  vehicle_number: { type: String },
  is_available: {type: String},
  
},{ timestamps: true });

const transportationSettings = mongoose.model('settings_transportation', transportationSchema);
export default transportationSettings;
