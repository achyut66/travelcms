import express from 'express';
const router = express.Router();
import assistantProfile from '../../models/Classification/AssistantDetails.js';  // Import your model
import BookingProfile from '../../models/Classification/Booking.js';
import bookingCompleteProfile from '../../models/Classification/BookingComplete.js';
import bookingCancelProfile from '../../models/Classification/BookingCancel.js'; // Import your model

// Define the route to handle the POST request
router.post("/assistant-register", async (req, res) => {
  try {
    const { assistants_name, booking_id } = req.body;

    const existing = await assistantProfile.find({ booking_id });    
    if (existing.length > 0) {
      return res.status(400).json({ message: "Booking already assigned." });
    }

    const canceled = await bookingCancelProfile.find({ booking_id });
    if (canceled.length > 0) {
      return res.status(400).json({ message: "Canceled Booking, Cant Asssign Task !!!" });
    }

    const completed = await bookingCompleteProfile.find({ booking_id });
    if (completed.length > 0) {
      return res.status(400).json({ message: "Completed Already, Cant Assign Task !!!" });
    }
    
    if (!assistants_name || !booking_id) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const assistant = new assistantProfile({
      assistants_name,
      booking_id,
    });

    await assistant.save();

    const booking = await BookingProfile.findById(booking_id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    } else {
      booking.flag = 1; 
      await booking.save();
    }


    res.status(201).json({
      message: "Assistant registered successfully.",
      data: assistant,
    });
  } catch (err) {
    console.error("Error saving assistant:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// router.get('/get-assistant-data-byid/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const assistantData = await assistantProfile.find({ booking_id: id });

//     if (!assistantData) {
//       return res.status(404).json({ message: "No data found." });
//     }

//     res.status(200).json({
//       message: "Assistant data retrieved successfully.",
//       data: assistantData,
//     });
//   } catch (err) {
//     console.error("Error retrieving assistant data:", err);
//     res.status(500).json({ message: "Server error." });
//   }
// }
// );

export default router;
