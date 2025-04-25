import mongoose from 'mongoose';

const languageSchema = new mongoose.Schema({
  language: { type: String, required: true },
  
},{ timestamps: true });

const languageSettings = mongoose.model('settings_language', languageSchema);
export default languageSettings;
