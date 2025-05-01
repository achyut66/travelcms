import mongoose from 'mongoose';

const pickupAssignSchema = new mongoose.Schema({
    booking_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'BookingProfile' },
    pickup_date: { type: String,required: true },
    assigned_person: { type: String,required: true },
    pickup_time: { type: String},
    vehicle_used: { type: String},
    vehicle_charge: { type: String},
  });
  
const pickupAssignProfile = mongoose.model('pickup_details', pickupAssignSchema);
export default pickupAssignProfile;
