import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  equipment_name: { type: String, required: true },
  number: { type: Number, required: true },
  rate: {type:Number},
  is_available:{type:String,required:true},
  
},{ timestamps: true });

const equipmentDetails = mongoose.model('inventory_equipment', equipmentSchema);
export default equipmentDetails;
