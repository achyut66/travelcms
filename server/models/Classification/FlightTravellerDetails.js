import mongoose from 'mongoose';

const flightTravellerSchema = new mongoose.Schema({
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "FlightBookingProfile", required: true },
    full_name: { type: String, required: true },
    dob: { type: String},
    gender: { type: String, required: true},
    nationality: { type: String},
    passport_no: { type: String, required: true },
    contact_no: { type: String},
    email: { type: String},
    special_req: { type: String }
  });
  
  const FlightTravellerProfile = mongoose.model('FlightTravellerProfile', flightTravellerSchema);
  export default FlightTravellerProfile;
  