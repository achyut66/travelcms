import dotenv from 'dotenv';
dotenv.config();
import express, { response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import FlightBookingInfo from '../../models/Classification/FlightsBooking.js';
import flightTravellerProfile from '../../models/Classification/FlightTravellerDetails.js';
import assistantProfile from '../../models/Classification/AssistantDetails.js'; // Import your model
import extrasSettings  from '../../models/Classification/Extras.js';
// import  packageSettings  from '../../models/Settings/Package.js';
import bookingCompleteProfile from '../../models/Classification/BookingComplete.js';  // Import your model
import mongoose from 'mongoose';
import { count } from 'console';
import nodemailer from 'nodemailer';

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const router = express.Router();

const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isInvoice = file.fieldname === 'invoice_receipt';
    const folder = isInvoice ? 'uploads/booking/invoice' : 'uploads/booking/visa';
    ensureDirExists(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// register router api
router.post('/flight-register', upload.fields([
    { name: 'invoice_receipt', maxCount: 1 },
    { name: 'visa_copies[]', maxCount: 20 }
  ]), async (req, res) => {
    try {
      const {

        company_name,
        dept_airport,
        arrv_airport,
        dept_date,
        dept_time,
        return_date,
        return_time,
        flight_no,
        service_class,
        no_of_checked_baggage,
        baggage_weight,
        additional_baggage,
        payment_method,
        full_name = [],
        dob = [],
        gender = [],
        nationality = [],
        passport_no = [],
        contact_no = [],
        special_req = [],
        email = [],
        pax_no = 1,
        flag = 0,
        travel_purpose,
      } = req.body;
  
      const invoiceFile = req.files['invoice_receipt']?.[0];
  
      const flightBooking = new FlightBookingInfo({
        company_name,
        dept_airport,
        arrv_airport,
        dept_date,
        dept_time,
        return_date,
        return_time,
        flight_no,
        service_class,
        payment_method,
        no_of_checked_baggage,
        baggage_weight,
        additional_baggage,
        pax_no,
        flag,
        invoice_receipt: invoiceFile ? invoiceFile.filename : '',
        travel_purpose,
      });
  
      const savedBooking = await flightBooking.save();
  
      const travellerNames = Array.isArray(full_name) ? full_name : [full_name];
      const nationalities = Array.isArray(nationality) ? nationality : [nationality];
      const passportNumbers = Array.isArray(passport_no) ? passport_no : [passport_no];
      const datesOfBirth = Array.isArray(dob) ? dob : [dob];
      const genders = Array.isArray(gender) ? gender : [gender];
      const emails = Array.isArray(email) ? email : [email];
      const contactNumbers = Array.isArray(contact_no) ? contact_no : [contact_no];
      const specialRequests = Array.isArray(special_req) ? special_req : [special_req];
  
      const travellers = [];
  
      for (let i = 0; i < travellerNames.length; i++) {
        travellers.push({
          booking_id: savedBooking._id,
          full_name: travellerNames[i] || '',
          dob: datesOfBirth[i] || '',
          gender: genders[i] || '',
          nationality: nationalities[i] || '',
          email:emails[i]||'',
          passport_no: passportNumbers[i] || '',
          contact_no: contactNumbers[i] || '',
          special_req: specialRequests[i] || '',
        });
      }
  
      await flightTravellerProfile.insertMany(travellers);
  
      res.status(201).json({ message: 'Flight booking created successfully' });
    } catch (err) {
      console.error('Error creating flight booking:', err);
      res.status(500).json({ message: 'Failed to register flight booking', error: err.message });
    }
  });
  

router.get('/get-flight-booking-details', async (req, res) => {
  try {
    const data = await FlightBookingInfo.find(); // fetches all bookings
    res.status(200).json({ message: "Data fetched successfully", data });
  } catch (error) {
    console.error("Fetch Error:", error.message);
    res.status(500).json({ message: "Error fetching data" });
  }
});

router.put(
  "/update-flight-booking-and-traveller/:id",
  upload.fields([
    { name: "invoice_receipt", maxCount: 1 },
    { name: "visa_copies" } 
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { pax_details, ...bookingData } = req.body;

      let parsedPaxDetails = [];
      if (pax_details && pax_details !== "undefined" && pax_details !== "") {
        try {
          parsedPaxDetails = JSON.parse(pax_details);
        } catch (err) {
          return res.status(400).json({ message: "Invalid pax_details format" });
        }
      }

      const updatedBooking = { ...bookingData };
      if (req.files?.invoice_receipt?.[0]) {
        updatedBooking.invoice_receipt = req.files.invoice_receipt[0].filename;
      }

      const booking = await FlightBookingInfo.findByIdAndUpdate(id, updatedBooking, { new: true });
      if (!booking) return res.status(404).json({ message: "Booking not found" });

      const updatedTravellers = parsedPaxDetails.map((traveller, index) => {
        if (!traveller.pax_no) {
          traveller.pax_no = 1; 
        }
        const updatedTraveller = {
          ...traveller,
          booking_id: id,
        };

        if (req.files?.visa_copies?.[index]) {
          updatedTraveller.visa_copy = req.files.visa_copies[index].filename;
        }

        return updatedTraveller;
      });

      await flightTravellerProfile.deleteMany({ booking_id: id });
      const savedTravellers = await flightTravellerProfile.insertMany(updatedTravellers);

      res.json({ message: "Booking updated successfully", booking, travellers: savedTravellers });
    } catch (error) {
      console.error("Error updating booking and travellers:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

router.get('/get-flightbooking-with-travellers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await FlightBookingInfo.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }
      },
      {
        $lookup: {
          from: 'flighttravellerprofiles',
          localField: '_id',
          foreignField: 'booking_id',
          as: 'travellers'
        }
      }
    ]);
    // console.log(result);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking with travellers fetched successfully', data: result[0] });
  } catch (error) {
    console.error("Error fetching joined booking:", error.message);
    res.status(500).json({ message: 'Failed to fetch booking with travellers', error: error.message });
  }
});
// search function
router.get('/booking-search', async (req, res) => {
  const query = req.query.q?.trim();

  try {
    let results;
    if (!query) {
      results = await BookingProfile.find({}).limit(50);
    } else {
      results = await BookingProfile.find({
        company_name: { $regex: query, $options: 'i' }
      }).limit(50);
    }
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// total count
router.get('/get-booking-count', async (req, res) => {
  try {
    const count = await BookingProfile.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get total number of booking holders with flag 0
router.get('/get-customer-with-flag', async (req,res) => {
  try {
    const result = await BookingProfile.countDocuments({flag:0});
    res.json({result});
  } catch(error) {
    res.status(500).json({error:error.message});
  }
});

router.get('/get-booking-by-month', async (req, res) => {
  try {
    const result = await BookingProfile.aggregate([
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$updatedAt" } }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } } // Sort by month ascending
    ]);

    res.json(result);
  } catch (error) {
    console.error('Error fetching booking count by month:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/get-assigned-bookings', async (req, res) => {
  try {
    const result = await BookingProfile.countDocuments({ flag: { $in: [1, 4] } });
    const data = await BookingProfile.find({ flag: { $in: [1, 4] } });
    res.json({ result, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/get-canceled-bookings', async (req, res) => {
  try {
    const result = await BookingProfile.countDocuments({ flag: 3 });
    const data = await BookingProfile.find({ flag: 3 });
    res.json({ result, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/get-completed-bookings', async (req, res) => {
  try {
    const result = await BookingProfile.countDocuments({ flag: 2 });
    const data = await BookingProfile.find({ flag: 2 });
    res.json({ result, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/get-booked-bookings', async (req, res) => {
  try {
    const result = await BookingProfile.countDocuments({ flag: 0 });
    const data = await BookingProfile.find({ flag: 0 });
    res.json({ result, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/get-booking-status-summary', async (req, res) => {
  try {
    const result = await BookingProfile.aggregate([
      {
        $group: {
          _id: "$flag", // group by flag
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/filter-by-date", async (req, res) => {
  const { from, to, column = "createdAt", status } = req.query;
  let filter = {};
  // console.log(filter);
  if (status) {
    filter.flag = status;
  }
  if (from && to && column) {
    filter[column] = {
      $gte: new Date(`${from}T00:00:00.000Z`),
      $lte: new Date(`${to}T23:59:59.999Z`)
    };
  }
  const result = await BookingProfile.find(filter);
  res.json(result);
  
});

router.get("/get-isassigned-booking", async (req, res) => {
  try {
    const result = await BookingProfile.find({ flag: 1 });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getdata-with-pickupdate", async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0)); 
    const formattedDate = startOfDay.toISOString().slice(0, 10);

    const twoDaysLater = new Date(startOfDay.getTime() + 2 * 24 * 60 * 60 * 1000); 
    twoDaysLater.setHours(0, 0, 0, 0); 
    const formattedTwoDaysLater = twoDaysLater.toISOString().slice(0, 10); 

    const response = await BookingProfile.find({
      pickup_date: {
        $gte: formattedDate,       
        $lte: formattedTwoDaysLater   
      },
      flag: { $ne: 4 }
    });
    const count = await BookingProfile.countDocuments({
      pickup_date: {
        $gte: formattedDate,       
        $lte: formattedTwoDaysLater   
      },
      flag: { $ne: 4 }
    });
    res.json({
      count: count,
      data: response
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

export default router;
