import mongoose from 'mongoose';

const equipmentDamageSchema = new mongoose.Schema({

  equip_id: { type: String, required: true },
  no_of_items: { type: Number, required: true },
  reason: {type:String},
  
},{ timestamps: true });

const equipmentDamageDetails = mongoose.model('inventory_damaged_equipment', equipmentDamageSchema);
export default equipmentDamageDetails;
