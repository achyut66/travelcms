import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
    booking_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'BookingProfile' },
    print_date: { type: String,required: true },
    receipt_no: { type: Number,required: true },
    receipt_type: {type: String},
  });
  
const receiptProfile = mongoose.model('receipt_print_details', receiptSchema);
export default receiptProfile;
