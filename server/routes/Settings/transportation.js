import express from 'express';
import  transportationSettings  from '../../models/Settings/Transportation.js';

const router = express.Router();

// Create Nationality
// Inside your route handler
router.post('/vehicle-register', async (req, res) => {
    console.log("Request body:", req.body);  // Log the full request body
  
    const { vehicle_type,vehicle_number } = req.body;
  
    if (!vehicle_type || typeof vehicle_type !== 'string') {
      return res.status(400).json({ message: 'Transportation is required and must be a string' });
    }

    if (!vehicle_number || typeof vehicle_number !== 'string') {
        return res.status(400).json({ message: 'Transportation is required and must be a string' });
      }
  
    try {
      const newNationality = new transportationSettings({ vehicle_type,vehicle_number });
      await newNationality.save();
      res.status(201).json({ message: 'Transportation added successfully', data: newNationality });
    } catch (error) {
      console.error('POST /transportation-register error:', error);
      res.status(500).json({ message: 'Something went wrong while saving package' });
    }
  });
  

// Get All Nationalities
router.get('/vehicle-data', async (req, res) => {
  try {
    const nationalities = await transportationSettings.find(); // optional: sort alphabetically
    res.status(200).json(nationalities);
  } catch (error) {
    console.error('GET /transportation-data error:', error);
    res.status(500).json({ message: 'Unable to fetch Transportation' });
  }
});

// Get Nationality by ID
router.get('/vehicle-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const nationality = await transportationSettings.findById(id);

    if (!nationality) {
      return res.status(404).json({ message: 'Transportation not found' });
    }

    res.status(200).json(nationality);
  } catch (error) {
    console.error(`GET /transportation-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error retrieving Transportation' });
  }
});
router.delete('/vehicle-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPurpose = await transportationSettings.findByIdAndDelete(id);

    if (!deletedPurpose) {
      return res.status(404).json({ message: 'Transportation not found' });
    }

    res.status(200).json({ message: 'Transportation deleted successfully' });
  } catch (error) {
    console.error(`DELETE /transportation-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error deleting Transportation' });
  }
});


// Update Nationality by ID
router.put('/vehicle-profile/:id', async (req, res) => {
  const { id } = req.params;
  const { vehicle_type } = req.body;
  const { vehicle_number } = req.body;

  if (!vehicle_type || typeof vehicle_type !== 'string') {
    return res.status(400).json({ message: 'Transportation is required and must be a string' });
  }
  if (!vehicle_number || typeof vehicle_number !== 'string') {
    return res.status(400).json({ message: 'Transportation is required and must be a string' });
  }

  try {
    const updatedNationality = await transportationSettings.findByIdAndUpdate(
      id,
      { vehicle_type, vehicle_number },
      { new: true }
    );

    if (!updatedNationality) {
      return res.status(404).json({ message: 'Transportation not found' });
    }
    res.status(200).json({ message: 'Transportation updated successfully', data: updatedNationality });
  } catch (error) {
    console.error(`PUT /vehicle-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error updating Transportation' });
  }
});

export default router;
