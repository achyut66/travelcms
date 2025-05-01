import mongoose from 'mongoose';

const bookingCompleteSchema = new mongoose.Schema({
    booking_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'BookingProfile' },
    completion_date: { type: String,required: true },
    completion_note: { type: String },
    package_rate: { type: Number },
  });
  

const bookingCompleteProfile = mongoose.model('is_booking_complete', bookingCompleteSchema);
export default bookingCompleteProfile;
