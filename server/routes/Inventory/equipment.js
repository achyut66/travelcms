import express from 'express';
import  equipmentDetails  from '../../models/Inventory/Equipment.js';
import BookingData from '../../models/Classification/Booking.js';

const router = express.Router();

// Create Nationality
// Inside your route handler
router.post('/equipment-register', async (req, res) => {
    try {
      const { equipment_name,number,rate,total_amt } = req.body;
      const is_available = 1;
      const available = number;
      if (!equipment_name || !number || !is_available || !total_amt || !rate ) {
        return res.status(400).json({ message: "Missing required fields." });
      }
      const newEquip = new equipmentDetails({
        equipment_name,
        number,
        is_available,
        total_amt,
        rate,
        available,
      });
      await newEquip.save();
      res.status(201).json({ message: "Eqipment Datas saved successfully.", data: newEquip });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  // equipment
 router.get('/equipment-data', async (req, res) => {
    try {
      const extras = await equipmentDetails.find();
      res.status(200).json(extras);
    } catch (error) {
      console.error('GET /equipment-data error:', error);
      res.status(500).json({ message: 'Unable to fetch equipment data' });
    }
  });
 router.get('/get-equipment-data-total', async (req, res) => {
  try {
    const extras = await equipmentDetails.find();
    const damaged_item_amt = extras.map(item => (item.damaged || 0) * (item.rate || 0));
    const remaining_item_amt = extras.map(item => (item.available || 0) * (item.rate || 0));

    res.status(200).json({
      extras,
      damaged_item_amt,
      remaining_item_amt
    });
  } catch (error) {
    console.error('GET /equipment-data error:', error);
    res.status(500).json({ message: 'Unable to fetch equipment data' });
  }
});

// delete
router.delete('/equipment-profile/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedItenery = await equipmentDetails.findByIdAndDelete(id);
      if (!deletedItenery) {
        return res.status(404).json({ message: 'Equipment not found' });
      }
      res.status(200).json({ 
        message: 'Equipment deleted successfully', 
        deleted: deletedItenery 
      });
    } catch (error) {
      console.error(`DELETE /equipment-profile/${id} error:`, error);
      res.status(500).json({ message: 'Error deleting itenery' });
    }
  });
// edit modal
router.get('/equipment-data-id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const editData = await equipmentDetails.findById(id);
    if (!editData) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    return res.status(200).json({ data: editData }); // always return the data
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return res.status(500).json({ message: "Error fetching data" });
  }
});
// Update Extra by ID
router.put('/equipment-update/:id', async (req, res) => {
    const { id } = req.params;
    const { equipment_name,number,is_available=1,rate,total_amt } = req.body;
    if (!equipment_name || !number || !is_available || !rate || !total_amt) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    try {
      const updatedExtra = await equipmentDetails.findByIdAndUpdate(
        id,
        {
          equipment_name,
          number,
          rate,
          total_amt,
          is_available,
        },
        { new: true } // Return the updated document
      );
      if (!updatedExtra) {
        return res.status(404).json({ message: "Equipment not found." });
      }
      res.status(200).json({ message: "Equipment updated successfully.", data: updatedExtra });
    } catch (error) {
      console.error(`PUT /equipment-update/${id} error:`, error);
      res.status(500).json({ message: "Error updating extra." });
    }
  });
// if damage 
router.get('/check-flag/:id', async (req,res) => {
  const {id} = req.params;
  try {
    const nextdata = await equipmentDetails.findByIdAndUpdate(id,{is_available: "0", new:true});
    res.status(500).json({message:"Equipment Flag Updated."});
  } catch(error) {
    res.status(200).json({message:"error fetching data"});
  }
});

export default router;
