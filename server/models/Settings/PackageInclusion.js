import mongoose from 'mongoose';

const packageInclusionSchema = new mongoose.Schema({
  package_id: { type: String },
  package_name: { type: String, required: true },
  inclusions_ids: { type: String },  // <-- Array of strings
  exclusions_ids: { type: String },  // <-- Array of strings
}, { timestamps: true });


const packageInclusionSettings = mongoose.model('inclusions_exclusions', packageInclusionSchema);
export default packageInclusionSettings;
