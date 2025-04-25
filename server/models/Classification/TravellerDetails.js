import mongoose from 'mongoose';

const travellerSchema = new mongoose.Schema({
    booking_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'BookingProfile' },
    pax_no: { type: Number, required: true },
    traveller_name: { type: String, required: true },
    special_request: { type: String },
    nationality: { type: String, required: true },
    passport_number: { type: String, required: true },
    visa_copies: { type: String }
  });
  

const travellerProfile = mongoose.model('traveller_details', travellerSchema);
export default travellerProfile;
