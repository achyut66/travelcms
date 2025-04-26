import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  airlines_name: { type: String, required: true },
  airlines_number: { type: String },
  
},{ timestamps: true });

const flightSettings = mongoose.model('settings_flight', flightSchema);
export default flightSettings;
