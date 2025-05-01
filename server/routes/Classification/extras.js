import express from 'express';
import  extrasSettings  from '../../models/Classification/Extras.js';
import BookingData from '../../models/Classification/Booking.js';

const router = express.Router();

// Create Nationality
// Inside your route handler
router.post('/extras-register', async (req, res) => {
    try {
      const { booking_id, extra_item, extra_item_price, extra_item_quantity,extra_item_amount } = req.body;
  
      if (!booking_id || !extra_item || !extra_item_price || !extra_item_quantity || !extra_item_amount) {
        return res.status(400).json({ message: "Missing required fields." });
      }
  
      const newExtra = new extrasSettings({
        booking_id,
        extra_item,
        extra_item_price,
        extra_item_quantity,
        extra_item_amount,
      });
  
      await newExtra.save();
      res.status(201).json({ message: "Extra saved successfully.", data: newExtra });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  
  // Get All Nationalities
 // Fetch itineraries grouped by package_name
 router.get('/extras-data', async (req, res) => {
    try {
      // Fetch extras data from extrasSettings collection
      const extras = await extrasSettings.aggregate([
        {
          $group: {
            _id: "$booking_id",
            extras: {
              $push: {
                _id: "$_id",
                extra_item: "$extra_item",
                extra_item_quantity: "$extra_item_quantity",
                extra_item_price: "$extra_item_price",
                extra_item_amount:"$extra_item_amount",
              }
            }
          }
        },
        {
          $project: {
            booking_id: "$_id",
            extras: 1,
            _id: 0
          }
        }
      ]);
  
      // Fetch company name (bookingName) for each booking_id
      const extrasWithCompanyName = await Promise.all(
        extras.map(async (extra) => {
          const bookingData = await BookingData.findById(extra.booking_id); // Fetch booking data by booking_id
          const company_name = bookingData ? bookingData.company_name : "Unknown"; // Default to "Unknown" if not found
          return {
            ...extra,
            company_name: company_name, // Attach company_name to the extras data
          };
        })
      );
  
      res.status(200).json(extrasWithCompanyName); // Send the updated data with company names
    } catch (error) {
      console.error('GET /extras-data error:', error);
      res.status(500).json({ message: 'Unable to fetch extras data' });
    }
  });
// delete
router.delete('/extras-profile/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedItenery = await extrasSettings.findByIdAndDelete(id);
      if (!deletedItenery) {
        return res.status(404).json({ message: 'Itenery not found' });
      }
      res.status(200).json({ 
        message: 'Itenery deleted successfully', 
        deleted: deletedItenery 
      });
    } catch (error) {
      console.error(`DELETE /itenery-profile/${id} error:`, error);
      res.status(500).json({ message: 'Error deleting itenery' });
    }
  });
  
// Update Extra by ID
router.put('/extras-update/:id', async (req, res) => {
    const { id } = req.params;
    const { booking_id, extra_item, extra_item_price, extra_item_quantity,extra_item_amount } = req.body;
  
    // Validate required fields
    if (!booking_id || !extra_item || !extra_item_price || !extra_item_quantity || !extra_item_amount) {
      return res.status(400).json({ message: "Missing required fields." });
    }
  
    try {
      const updatedExtra = await extrasSettings.findByIdAndUpdate(
        id,
        {
          booking_id,
          extra_item,
          extra_item_price,
          extra_item_quantity,
          extra_item_amount,
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedExtra) {
        return res.status(404).json({ message: "Extra not found." });
      }
  
      res.status(200).json({ message: "Extra updated successfully.", data: updatedExtra });
    } catch (error) {
      console.error(`PUT /extras-update/${id} error:`, error);
      res.status(500).json({ message: "Error updating extra." });
    }
  });

// get by booking_id
router.get("/get-by-bookingid/:booking_id", async (req, res) => {
  const { booking_id } = req.params;

  try {
    const response = await extrasSettings.find({ booking_id });

    if (!response || response.length === 0) {
      // Send `null` instead of [] to make frontend logic easier
      return res.json(null);
    }
    res.json(response);
  } catch (error) {
    console.log("Error fetching data", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
