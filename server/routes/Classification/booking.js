import dotenv from 'dotenv';
dotenv.config();
import express, { response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import BookingProfile from '../../models/Classification/Booking.js';
import TravellerProfile from '../../models/Classification/TravellerDetails.js';
import assistantProfile from '../../models/Classification/AssistantDetails.js'; // Import your model
import extrasSettings  from '../../models/Classification/Extras.js';
// import  packageSettings  from '../../models/Settings/Package.js';
import bookingCompleteProfile from '../../models/Classification/BookingComplete.js';  // Import your model
import mongoose from 'mongoose';
import { count } from 'console';
import nodemailer from 'nodemailer';

// import accountProfile from '../../models/Account/AccountEntry.js';

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
router.post('/booking-register', upload.fields([
  { name: 'invoice_receipt', maxCount: 1 },
  { name: 'visa_copies[]', maxCount: 20 } // Allow up to 20 visa files
]), async (req, res) => {
  try {
    // Destructure booking details from request body
    const {
      company_name, company_address, contact_person, contact_number, contact_email,
      package_name, departure_date, return_date, pickup_location, drop_location,
      method, promo_code, payment_status,
      special_instruction, preferred_language, purpose,
      pickup_date,
      airlines_name, flight_taken_date, flight_number, flight_time,
      pax_no = 1, // default pax_no to 1 if not provided
      traveller_name = [],
      nationality = [],
      passport_number = [],
      special_request = [],
      flag = 0,
      extra_total = 0,
      package_total = 0,
    } = req.body;

    // Get the uploaded invoice file
    const invoiceFile = req.files['invoice_receipt']?.[0];

    const booking = new BookingProfile({
      company_name, company_address, contact_person, contact_number, contact_email,
      package_name, departure_date, return_date, pickup_location, drop_location,
      method, promo_code, payment_status,
      invoice_receipt: invoiceFile ? invoiceFile.filename : '', // Save invoice filename
      special_instruction, preferred_language, purpose,pax_no,flag,pickup_date,airlines_name, flight_taken_date, flight_number, flight_time,
      extra_total,package_total,
    });
    const savedBooking = await booking.save();
    const paxCount = parseInt(pax_no) || 1;

    const travellerNames = Array.isArray(traveller_name) ? traveller_name : [traveller_name];
    const nationalities = Array.isArray(nationality) ? nationality : [nationality];
    const passportNumbers = Array.isArray(passport_number) ? passport_number : [passport_number];
    const specialRequests = Array.isArray(special_request) ? special_request : [special_request];

    // Get uploaded visa files
    const visaFiles = req.files['visa_copies[]'] || [];
    // Prepare travellers data
    const travellers = [];
    for (let i = 0; i < paxCount; i++) {
      travellers.push({
        booking_id: savedBooking._id,
        pax_no: paxCount,
        traveller_name: travellerNames[i] || '',
        special_request: specialRequests[i] || '',
        nationality: nationalities[i] || '',
        passport_number: passportNumbers[i] || '',
        visa_copies: visaFiles[i] ? visaFiles[i].filename : ''
      });
    }
    await TravellerProfile.insertMany(travellers);
    // send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: contact_email,
      subject: `Booking Confirmation for ${package_name}`,
      html: `
        <h2>Dear ${contact_person},</h2>
        <p>Thank you for booking with us.</p>
        <p><strong>Package:</strong> ${package_name}</p>
        <p><strong>Departure:</strong> ${departure_date}</p>
        <p><strong>Return:</strong> ${return_date}</p>
        <p>We will contact you soon with further details.</p>
        <br />
        <p>Warm regards,</p>
        <p><strong>Pokalde Travel & Tours</strong></p>
      `
    });
    res.status(201).json({ message: 'Booking with travellers created successfully' });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Failed to register booking', error: err.message });
  }
});

router.get('/get-booking-details', async (req, res) => {
  try {
    const data = await BookingProfile.find(); // fetches all bookings
    res.status(200).json({ message: "Data fetched successfully", data });
  } catch (error) {
    console.error("Fetch Error:", error.message);
    res.status(500).json({ message: "Error fetching data" });
  }
});

router.put(
  "/update-booking-and-traveller/:id",
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

      const booking = await BookingProfile.findByIdAndUpdate(id, updatedBooking, { new: true });
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

      await TravellerProfile.deleteMany({ booking_id: id });
      const savedTravellers = await TravellerProfile.insertMany(updatedTravellers);

      res.json({ message: "Booking updated successfully", booking, travellers: savedTravellers });
    } catch (error) {
      console.error("Error updating booking and travellers:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

router.get('/get-booking-with-travellers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await BookingProfile.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }
      },
      {
        $lookup: {
          from: 'traveller_details',
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

// fetch data to report
// router.get('/get-booking-with-expense', async (req, res) => {
//   try {
//     const data = await BookingProfile.aggregate([
//       {
//         $lookup: {
//           from: "extras", // collection name in lowercase & plural
//           localField: "_id",     // BookingProfile._id
//           foreignField: "booking_id", // extrasSettings.booking_id
//           as: "extras"
//         }
//       },
//       {
//         $lookup: {
//           from: "is_booking_completes", // collection name in lowercase & plural
//           localField: "_id",        // BookingProfile._id
//           foreignField: "booking_id", // packageSettings.booking_id
//           as: "package"
//         }
//       }
//     ]);

//     res.status(200).json(data);
//   } catch (error) {
//     console.error("Fetch Error:", error.message);
//     res.status(500).json({ message: "Error fetching data" });
//   }
// });

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

router.get("/month-wise-account-report", async (req, res) => {
  try {
    // Step 1: Run aggregation grouped by year & month
    const aggregationResult = await BookingProfile.aggregate([
      {
        $match: { flag: 2 }  // If you want to filter by flag=2, else remove this
      },
      {
        $addFields: {
          monthNum: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
      },
      {
        $group: {
          _id: { year: "$year", monthNum: "$monthNum" },
          count: { $sum: 1 },
          package_total: { $sum: "$package_total" },
          extra_total: { $sum: "$extra_total" },
          receive_amount: { $sum: "$receive_amount" },
          due_amount: { $sum: "$due_amount" },
          ids: { $push: "$_id" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.monthNum": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          monthNum: "$_id.monthNum",
          count: 1,
          package_total: 1,
          extra_total: 1,
          receive_amount: 1,
          due_amount: 1,
          ids: 1,
        },
      },
    ]);

    const years = [...new Set(aggregationResult.map(item => item.year))];
    if (years.length === 0) years.push(new Date().getFullYear());

    const allMonths = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const fullData = [];

years.forEach(year => {
  const monthsForYear = allMonths.map((monthName, idx) => ({
    month: monthName, 
    count: 0,
    package_total: 0,
    extra_total: 0,
    receive_amount: 0,
    due_amount: 0,
  }));

  aggregationResult
    .filter(item => item.year === year)
    .forEach(item => {
      monthsForYear[item.monthNum - 1] = {
        month: allMonths[item.monthNum - 1],  // only month name here too
        count: item.count,
        package_total: item.package_total,
        extra_total: item.extra_total,
        receive_amount: item.receive_amount,
        due_amount: item.due_amount,
        ids: item.ids,

      };
    });
  fullData.push(...monthsForYear);
});

    res.status(200).json({
      message: "Fetched successfully",
      data: fullData,
      year:years,
    });
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({
      message: "Error fetching data",
      error: error.message,
    });
  }
});

router.post("/account-report/details", async (req, res) => {
  const { ids } = req.body;
  try {
    const result = await BookingProfile.find({ _id: { $in: ids } });
    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ message: "Error fetching details", error });
  }
});

router.post("/get-account-data-byid",async (req,res) => {
  const {id} = req.body;
  try {
    const result = await BookingProfile.findById(id);
    res.json({data:result});
  } catch(error) {
    res.status(500).json({message:"error fetching data"});
  }
});


export default router;
