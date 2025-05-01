import express from 'express';
import  itenerySettings  from '../../models/Classification/Itenery.js';

const router = express.Router();

// Create Nationality
// Inside your route handler
router.post('/itenery-register', async (req, res) => {
    try {
      const { package_name, itinerary } = req.body;
  
      if (!package_name || !itinerary) {
        return res.status(400).json({ message: "Missing required fields." });
      }
  
      const newItinerary = new itenerySettings({
        package_name,
        itinerary,
      });
  
      await newItinerary.save();
      res.status(201).json({ message: "Itinerary saved successfully.", data: newItinerary });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  // Get All Nationalities
 // Fetch itineraries grouped by package_name
 router.get('/itenery-data', async (req, res) => {
    try {
      const itineraries = await itenerySettings.aggregate([
        {
          $group: {
            _id: "$package_name",
            itineraries: {
              $push: {
                _id: "$_id",     
                itinerary: "$itinerary" 
              }
            }
          }
        }
      ]);
      // console.log(itineraries);
      res.status(200).json(itineraries);
    } catch (error) {
      console.error('GET /itenery-data error:', error);
      res.status(500).json({ message: 'Unable to fetch itinerary data' });
    }
  });
  
// delete
router.delete('/itenery-profile/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedItenery = await itenerySettings.findByIdAndDelete(id);
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
  
// Get Nationality by ID
router.get('/itenery-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const nationality = await itenerySettings.findById(id);
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
router.put('/itenery-profile/:id', async (req, res) => {
    const { id } = req.params;
    const { package_name, itinerary } = req.body; // <-- FIX field names
    console.log(id);
  
    if (!package_name || typeof package_name !== 'string') {
      return res.status(400).json({ message: 'Package name is required and must be a string' });
    }
    if (!itinerary || typeof itinerary !== 'string') {
      return res.status(400).json({ message: 'Itinerary is required and must be a string' });
    }
  
    try {
      const updatedItinerary = await itenerySettings.findByIdAndUpdate(
        id,
        { package_name, itinerary }, // <-- update with correct fields
        { new: true }
      );
  
      if (!updatedItinerary) {
        return res.status(404).json({ message: 'Itinerary not found' });
      }
  
      res.status(200).json({ message: 'Itinerary updated successfully', data: updatedItinerary });
    } catch (error) {
      console.error(`PUT /itenery-profile/${id} error:`, error);
      res.status(500).json({ message: 'Error updating itinerary' });
    }
  });

  router.get('/getby-packagename/:package_name', async (req, res) => {
    const { packageName } = req.params;
  
    try {
      const itinerary = await itenerySettings.find({ package_name });
  
      if (itinerary.length === 0) {
        return res.status(404).json({ message: 'Itinerary not found' });
      }
  
      res.status(200).json(itinerary);
    } catch (error) {
      console.error(`GET /getby-packagename/${package_name} error:`, error);
      res.status(500).json({ message: 'Error retrieving itinerary' });
    }
  });
  
  

export default router;
