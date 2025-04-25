import mongoose from 'mongoose';

const bookingCancelSchema = new mongoose.Schema({
    booking_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'BookingProfile' },
    cancel_reason: { type: String,required: true },
  },{ timestamps: true });
  

const bookingCancelProfile = mongoose.model('is_booking_canceled', bookingCancelSchema);
export default bookingCancelProfile;
