import mongoose from 'mongoose';

const extrasSchema = new mongoose.Schema({
  booking_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'BookingProfile' },
  extra_item: { type: String, required: true },
  extra_item_price: { type: Number, required: true },
  extra_item_quantity: { type: Number},
  extra_item_amount: { type: Number},
  
},{ timestamps: true });

const extrasSettings = mongoose.model('extras', extrasSchema);
export default extrasSettings;
