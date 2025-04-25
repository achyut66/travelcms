import mongoose from 'mongoose';

const assistantProfileSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  assistants_name: {
    type: String, // This defines an array of strings
    required: true,
  },
},{ timestamps: true });

const assistantProfile = mongoose.model('assistants_details', assistantProfileSchema);
export default assistantProfile;
