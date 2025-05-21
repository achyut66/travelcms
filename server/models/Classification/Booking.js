// models/Classification/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  company_name: { type: String, required: true },
  company_address: { type: String, required: true },
  contact_person: { type: String, required: true },
  contact_number: { type: String, required: true },
  contact_email: { type: String,required:true },

  package_name: { type: String, required: true },
  departure_date: { type: Date, required: true },
  return_date: { type: Date, required: true },
  pickup_location: { type: String, required: true },
  pickup_date: { type: Date, required:true },
  drop_location: { type: String, required: true },

  method: { type: String},
  promo_code: { type: String },
  payment_status: { type: String},
  invoice_receipt: { type: String},

  special_instruction: { type: String },
  preferred_language: { type: String },
  purpose: { type: String, required: true },
  pax_no: { type: Number, required: true },
  flag: { type: Number, required: true },

  airlines_name: { type: String },
  flight_taken_date : { type: Date },
  flight_number: { type: String },
  flight_time: { type: String }, 
  
  extra_total: {type:Number},
  package_total: {type:Number},
  receive_amount: {type:Number },
  due_amount: {type:Number },
  

}, { timestamps: true });

const BookingProfile = mongoose.model('BookingProfile', bookingSchema);
export default BookingProfile;
