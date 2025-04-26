import express from 'express';
import  flightSettings  from '../../models/Settings/Flight.js';

const router = express.Router();

// Create Nationality
// Inside your route handler
router.post('/flight-register', async (req, res) => {
    console.log("Request body:", req.body);  // Log the full request body
  
    const { airlines_name,airlines_number } = req.body;
  
    if (!airlines_name || typeof airlines_name !== 'string') {
      return res.status(400).json({ message: 'Transportation is required and must be a string' });
    }

    if (!airlines_number || typeof airlines_number !== 'string') {
        return res.status(400).json({ message: 'Transportation is required and must be a string' });
      }
  
    try {
      const newNationality = new flightSettings({ airlines_name,airlines_number });
      await newNationality.save();
      res.status(201).json({ message: 'Flight added successfully', data: newNationality });
    } catch (error) {
      console.error('POST /transportation-register error:', error);
      res.status(500).json({ message: 'Something went wrong while saving package' });
    }
  });
  

// Get All Nationalities
router.get('/flight-data', async (req, res) => {
  try {
    const nationalities = await flightSettings.find(); // optional: sort alphabetically
    res.status(200).json(nationalities);
  } catch (error) {
    console.error('GET /transportation-data error:', error);
    res.status(500).json({ message: 'Unable to fetch Transportation' });
  }
});

// Get Nationality by ID
router.get('/flight-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const nationality = await flightSettings.findById(id);

    if (!nationality) {
      return res.status(404).json({ message: 'Transportation not found' });
    }

    res.status(200).json(nationality);
  } catch (error) {
    console.error(`GET /transportation-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error retrieving Transportation' });
  }
});
router.delete('/flight-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPurpose = await flightSettings.findByIdAndDelete(id);

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
router.put('/flight-profile/:id', async (req, res) => {
  const { id } = req.params;
  const { airlines_name } = req.body;
  const { airlines_number } = req.body;

  if (!airlines_name || typeof airlines_name !== 'string') {
    return res.status(400).json({ message: 'Transportation is required and must be a string' });
  }
  if (!airlines_number || typeof airlines_number !== 'string') {
    return res.status(400).json({ message: 'Transportation is required and must be a string' });
  }

  try {
    const updatedNationality = await flightSettings.findByIdAndUpdate(
      id,
      { airlines_name, airlines_number },
      { new: true }
    );

    if (!updatedNationality) {
      return res.status(404).json({ message: 'Transportation not found' });
    }
    res.status(200).json({ message: 'Transportation updated successfully', data: updatedNationality });
  } catch (error) {
    console.error(`PUT /flight-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error updating Transportation' });
  }
});

export default router;
