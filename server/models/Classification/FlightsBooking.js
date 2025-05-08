// models/Classification/Booking.js
import mongoose from 'mongoose';

const flightBookingSchema = new mongoose.Schema({

  company_name: { type: String,required:true},
  dept_airport: { type: String, required: true },
  arrv_airport: { type: String, required: true },
  dept_date: { type: Date, required: true },
  dept_time: { type: String, required: true },
  return_date: { type: Date },
  return_time: { type: String },
  flight_no: { type: String},
  service_class: { type: String, required: true },
  no_of_checked_baggage: { type: Number },
  baggage_weight: { type: String },
  additional_baggage: { type: Number },
  payment_method: { type: String },
  billing_address: { type: String },
  insurance: { type: String },
  special_assist: { type: String },
  pax_no: { type: Number, required: true },
  flag: {type: Number}
}, { timestamps: true });

const FlightBookingProfile = mongoose.model('FlightBookingProfile', flightBookingSchema);
export default FlightBookingProfile;
