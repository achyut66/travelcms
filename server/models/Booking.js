import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    // customer information
  full_name: { type: String, required: true },
  contact_email: { type: String, required: true },
  address: { type: String, required: true },
  contact_number: { type: String, required: true },
  nationality: { type: String, required: true },
  passport_number: { type: String, required: true },
  emergency_contact: { type: String},
   // traveller details
   pax_no: { type: Int8Array, required: true },
   traveller_name: { type: String, required: true },
   spc_request: { type: String, required: true },
   room_preference: { type: String, required: true },
    //    travel details
   pack_name: { type: String, required: true },
   dept_date: { type: Date, required: true },
   rtn_date: { type: Date, required: true },
   pick_location: { type: String, required: true },
   drop_location: { type: String, required: true },
   extras: { type: String, required: true },
    // payment information
    method: { type: String, required: true },
    promo_code: { type: Date, required: true },
    payment_status: { type: Date, required: true }, //partial / full
    amt_breakdown: { type: String, required: true },//pck cost-taxes-discounts
    inv_receipt: { type: String, required: true },//invoice or receipt generation

    // documents
    passport_id: { type: File, required: true },//(PDF/Image)
    visa_copies: { type: File, required: true },//(for outbound/inbound destinations))
    covid_cert: { type: File, required: true }, //partial / full

    // optional
    spcl_instruction: { type: String, required: true },//notes for agency
    preferreed_lang: { type: String, required: true },//(for communication))
    mem_code: { type: String, required: true }, // (if repeat customer)
    purpose: { type: String, required: true }, // (leisure, business, honeymoon, etc.)
  
},{ timestamps: true });

const BookingProfile = mongoose.model('Bookingprofile', bookingSchema);
export default BookingProfile;
