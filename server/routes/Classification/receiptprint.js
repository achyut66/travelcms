import express from 'express';
const router = express.Router();
import receiptProfile from '../../models/Classification/Receipt.js';  // Import your model

// Define the route to handle the POST request
router.post('/receipt-print-register', async (req, res) => {
    try {
      const { booking_id, print_date, receipt_no } = req.body;
      if (!print_date || !booking_id || !receipt_no) {
        return res.status(400).json({ message: "All fields are required." });
      }
      const existing = await receiptProfile.findOne({ booking_id });
      let result;
      if (!existing) {
        // Create new
        const bookingCancel = new receiptProfile({
          booking_id,
          print_date,
          receipt_no,
        });
        result = await bookingCancel.save();
      } else {
        // Update existing
        result = await receiptProfile.findOneAndUpdate(
          { booking_id },
          { print_date, receipt_no },
          { new: true }
        );
      }
      res.json({ message: "Receipt Print saved successfully", data: result });
    } catch (error) {
      console.error("Error saving receipt print:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
//   router.get("/get-count",async (req,res) => {
//     try {
//         const count = await receiptProfile.countDocuments();
//         res.json({ message:"count fetched successfully", data:count});
//     } catch(error) {
//         res.json({message:"server error", error: error.message});
//     }
//   });
router.get("/get-latest-receipt", async (req, res) => {
    try {
      const { booking_id } = req.query;
  
      // Find existing receipt for the same booking_id
      const existing = await receiptProfile.findOne({ booking_id }).sort({ _id: -1 });
  
      if (existing) {
        return res.json({
          message: "Existing receipt found",
          receipt_no: existing.receipt_no,
          isDuplicate: true,
        });
      }
  
      // Get last receipt to determine next receipt_no
      const lastReceipt = await receiptProfile.findOne().sort({ receipt_no: -1 });
  
      const newReceiptNo = lastReceipt ? lastReceipt.receipt_no + 1 : 1;
  
      res.json({
        message: "New receipt number generated",
        receipt_no: newReceiptNo,
        isDuplicate: false,
      });
  
    } catch (error) {
      console.error("Error fetching receipt number:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  
  
  
export default router;
