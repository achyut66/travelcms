import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  package: { type: String, required: true },
  
},{ timestamps: true });

const packageSettings = mongoose.model('settings_package', packageSchema);
export default packageSettings;
