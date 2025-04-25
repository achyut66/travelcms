import express from 'express';
const router = express.Router();
import bookingCompleteProfile from '../../models/Classification/BookingComplete.js';  // Import your model
import BookingProfile from '../../models/Classification/Booking.js';
import assistantProfile from '../../models/Classification/AssistantDetails.js';
import bookingCancelProfile from '../../models/Classification/BookingCancel.js';

// Define the route to handle the POST request
router.post("/booking-complete-register", async (req, res) => {
  try {
    const { booking_id, completion_date,completion_note,package_rate } = req.body;

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
      return res.status(400).json({ message: "Canceled Booking, Cant Complete Task !!!" });
    }

    if (!completion_date || !booking_id) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const bookingComplete = new bookingCompleteProfile({
        booking_id,
        completion_date,
        completion_note,
        package_rate,
    });

    await bookingComplete.save();

    const booking = await BookingProfile.findById(booking_id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    } else {
      booking.flag = 2; 
      await booking.save();
    }

    res.status(201).json({
      message: "Booking Completed Successfully.",
    });
  } catch (err) {
    console.error("Error saving assistant:", err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;
