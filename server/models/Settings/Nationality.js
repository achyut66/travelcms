import mongoose from 'mongoose';

const nationalitySchema = new mongoose.Schema({
  nationality: { type: String, required: true },
  code: {type:String},
  
},{ timestamps: true });

const nationalitySettings = mongoose.model('settings_nationality', nationalitySchema);
export default nationalitySettings;
