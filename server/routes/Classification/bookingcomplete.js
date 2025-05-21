import express from 'express';
const router = express.Router();
import bookingCompleteProfile from '../../models/Classification/BookingComplete.js';  // Import your model
import BookingProfile from '../../models/Classification/Booking.js';
import assistantProfile from '../../models/Classification/AssistantDetails.js';
import bookingCancelProfile from '../../models/Classification/BookingCancel.js';
import extrasSettings  from '../../models/Classification/Extras.js';
import  packageSettings  from '../../models/Settings/Package.js';


// Define the route to handle the POST request
router.post("/booking-complete-register", async (req, res) => {
  try {
    const { booking_id, completion_date, completion_note, package_rate, receive_amount } = req.body;

    const booking = await BookingProfile.findById(booking_id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Get package rate
    const packageData = await packageSettings.findOne({ package: booking.package_name });
    const packagevalue = packageData ? Number(packageData.rate || 0) : 0;

    // Calculate total of extras
    const extraData = await extrasSettings.find({ booking_id });
    let extraTotal = 0;
    if (extraData && extraData.length > 0) {
      extraTotal = extraData.reduce((sum, extra) => sum + Number(extra.extra_item_amount || 0), 0);
    }

    // Validation checks
    const assigned = await assistantProfile.find({ booking_id });
    if (assigned.length < 1) {
      return res.status(400).json({ message: "Ouchhh !!! You Have Not Assigned Tasks." });
    }

    const completed = await bookingCompleteProfile.find({ booking_id });
    if (completed.length > 0) {
      return res.status(400).json({ message: "Booking Already Completed !!!" });
    }

    const canceled = await bookingCancelProfile.find({ booking_id });
    if (canceled.length > 0) {
      return res.status(400).json({ message: "Canceled Booking, Can't Complete Task !!!" });
    }

    if (!completion_date || !booking_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Save completion info
    const bookingComplete = new bookingCompleteProfile({
      booking_id,
      completion_date,
      completion_note,
      package_rate: packagevalue,
    });
    await bookingComplete.save();

    // Update original booking

    const total_income = extraTotal + packagevalue;
    // console.log(total_income);
    const receive = Number(receive_amount ||0);
    const due_amountt = total_income - receive;
    booking.extra_total = extraTotal;
    booking.package_total = packagevalue;
    booking.receive_amount = receive_amount;
    booking.due_amount = due_amountt;
    booking.flag = 2;
    await booking.save();

    res.status(201).json({
      message: "Booking Completed Successfully.",
    });

  } catch (err) {
    console.error("Error completing booking:", err);
    res.status(500).json({ message: "Server error." });
  }
});


router.get("/getifbookingcompleted", async (req, res) => {
  try {
    const bookingData = await BookingProfile.find(); 
    const completeData = await bookingCompleteProfile.find(); 
    const completedBookingIds = completeData.map((item) => item.booking_id.toString());
    const filteredBookingData = bookingData.filter((booking) =>
      completedBookingIds.includes(booking._id.toString()) 
    );
    // console.log('Filtered Booking Data:', filteredBookingData);
    res.json(filteredBookingData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});


export default router;
