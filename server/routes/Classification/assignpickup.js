import express from 'express';
const router = express.Router();
import pickupAssignProfile from '../../models/Classification/AssignPickUp.js';  // Import your model
import bookingCompleteProfile from '../../models/Classification/BookingComplete.js';  // Import your model
import bookingCancelProfile from '../../models/Classification/BookingCancel.js';  // Import your model

// Define the route to handle the POST request
router.post("/pickup-register", async (req, res) => {
    try {
      const { booking_id, pickup_date, assigned_person,pickup_time,vehicle_used,vehicle_charge } = req.body;
      
      if (!pickup_date || !booking_id) {
        return res.status(400).json({ message: "All fields are required." });
      }
      const Completed = await bookingCompleteProfile.find({ booking_id });
      if (Completed.length > 0) {
        return res.status(400).json({ message: "Completed Tasts Cant Operate!!!" });
      }
      const Cancel = await bookingCancelProfile.find({ booking_id });
      if (Cancel.length > 0) {
        return res.status(400).json({ message: "Canceled Booking Cant Operate !!!" });
      }
      const alreadyCompleted = await pickupAssignProfile.findOne({ booking_id });
      if (alreadyCompleted) {
        return res.status(400).json({ message: "Pickup Already Completed !!!" });
      }
      const bookingComplete = new pickupAssignProfile({
        booking_id,
        pickup_date,
        assigned_person,
        pickup_time,
        vehicle_used,
        vehicle_charge
      });
      await bookingComplete.save();
      return res.status(200).json({ message: "Pickup Assigned Successfully." });
    } catch (err) {
      console.error("Error saving pickup assignment:", err);
      return res.status(500).json({ message: "Server error." });
    }
  });
  

export default router;
