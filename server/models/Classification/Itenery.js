import mongoose from 'mongoose';

const itenerySchema = new mongoose.Schema({
  package_name: { type: String, required: true },
  itinerary: { type: String, required: true },
  
},{ timestamps: true });

const itenerySettings = mongoose.model('iteneries', itenerySchema);
export default itenerySettings;
