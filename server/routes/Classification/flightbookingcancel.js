import express from 'express';
const router = express.Router();
import bookingCancelProfile from '../../models/Classification/BookingCancel.js';  // Import your model
import BookingProfile from '../../models/Classification/Booking.js';
import bookingassistantProfile from '../../models/Classification/AssistantDetails.js'; // Import your model
import bookingCompleteProfile from '../../models/Classification/BookingComplete.js'; // Import your model

// Define the route to handle the POST request
router.post('/booking-cancel-register', async (req, res) => {
    try {
      const { booking_id, cancel_reason } = req.body;
      const completed = await bookingCompleteProfile.find({ booking_id });
      if (completed.length > 0) {
        return res.status(400).json({ message: "Completed Task Can't Cancel !!! " });
      }
  
      if (!cancel_reason || !booking_id) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      const booking = await BookingProfile.findByIdAndUpdate(
        booking_id,
        { flag: 3 },
        { new: true }
      );
  
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json({ message: "Booking cancelled successfully", booking });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  router.get('/get-cancel-count/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const cancelCount = await bookingCancelProfile.countDocuments({ booking_id: id });
      if (cancelCount > 0) {
        return res.status(200).json({
          message: 'Booking is cancelled',
          count: cancelCount,
        });
      } else {
        return res.status(200).json({
          message: 'Booking is not cancelled',
          count: cancelCount,
        });
      }
    } catch (error) {
      console.error("Error checking cancel count:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
  
  
export default router;
