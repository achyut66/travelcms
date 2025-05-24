import express from 'express';
import packageInclusionSettings  from '../../models/Settings/PackageInclusion.js';

const router = express.Router();

// Create Nationality
// Inside your route handler
router.post('/inclusion-register', async (req, res) => {
    try {
      const { items_name } = req.body;
  
      if (!items_name) {
        return res.status(400).json({ message: "Missing required fields." });
      }
  
      const newItinerary = new inclusionSettings({
        items_name,
      });
  
      await newItinerary.save();
      res.status(200).json({ message: "Items saved successfully.", data: newItinerary });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  
 router.get('/inclusion-exclusion-data-by-package-name/:package_name', async (req, res) => {
    const { package_name } = req.params;
    try {
      const itineraries = await packageInclusionSettings.find({ package_name: package_name});
      res.status(200).json(itineraries);
    } catch (error) {
      console.error('GET /inclusion-exclusion-data-by-package-name error:', error);
      res.status(500).json({ message: 'Unable to fetch items data' });
    }
  });
  
// delete
router.delete('/inclusion-profile/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedItenery = await inclusionSettings.findByIdAndDelete(id);
      if (!deletedItenery) {
        return res.status(404).json({ message: 'Items not found' });
      }
      res.status(200).json({ 
        message: 'Item deleted successfully', 
        deleted: deletedItenery 
      });
    } catch (error) {
      console.error(`DELETE /inclusion-profile/${id} error:`, error);
      res.status(500).json({ message: 'Error deleting itenery' });
    }
  });
  
// Get Nationality by ID
router.get('/inclusion-profile/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const nationality = await inclusionSettings.findById(id);
    if (!nationality) {
      return res.status(404).json({ message: 'package not found' });
    }
    res.status(200).json(nationality);
  } catch (error) {
    console.error(`GET /package-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error retrieving nationality' });
  }
});

// Update Nationality by ID
router.put('/inclusion-profile/:id', async (req, res) => {
    const { id } = req.params;
    const { items_name} = req.body; // <-- FIX field names
  
    if (!items_name || typeof items_name !== 'string') {
      return res.status(400).json({ message: 'Package name is required and must be a string' });
    }
  
    try {
      const updatedItinerary = await inclusionSettings.findByIdAndUpdate(
        id,
        { items_name}, // <-- update with correct fields
        { new: true }
      );
  
      if (!updatedItinerary) {
        return res.status(404).json({ message: 'Items not found' });
      }
  
      res.status(200).json({ message: 'Items updated successfully', data: updatedItinerary });
    } catch (error) {
      console.error(`PUT /inclusion-profile/${id} error:`, error);
      res.status(500).json({ message: 'Error updating itinerary' });
    }
  });

export default router;
