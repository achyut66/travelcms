import express from 'express';
import  nationalitySettings  from '../../models/Settings/Nationality.js';

const router = express.Router();

// Create Nationality
// Inside your route handler
router.post('/nationality-register', async (req, res) => {
    console.log("Request body:", req.body);  // Log the full request body
  
    const { nationality } = req.body;
  
    if (!nationality || typeof nationality !== 'string') {
      return res.status(400).json({ message: 'Nationality is required and must be a string' });
    }
  
    try {
      const newNationality = new nationalitySettings({ nationality });
      await newNationality.save();
      res.status(201).json({ message: 'Nationality added successfully', data: newNationality });
    } catch (error) {
      console.error('POST /nationality-register error:', error);
      res.status(500).json({ message: 'Something went wrong while saving nationality' });
    }
  });
  

// Get All Nationalities
router.get('/nationality-data', async (req, res) => {
  try {
    const nationalities = await nationalitySettings.find().sort({ nationality: 1 }); // optional: sort alphabetically
    res.status(200).json(nationalities);
  } catch (error) {
    console.error('GET /nationality-data error:', error);
    res.status(500).json({ message: 'Unable to fetch nationalities' });
  }
});

// Get Nationality by ID
router.get('/nationality-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const nationality = await nationalitySettings.findById(id);

    if (!nationality) {
      return res.status(404).json({ message: 'Nationality not found' });
    }

    res.status(200).json(nationality);
  } catch (error) {
    console.error(`GET /nationality-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error retrieving nationality' });
  }
});

// Update Nationality by ID
router.put('/nationality-profile/:id', async (req, res) => {
  const { id } = req.params;
  const { nationality } = req.body;

  if (!nationality || typeof nationality !== 'string') {
    return res.status(400).json({ message: 'Nationality is required and must be a string' });
  }

  try {
    const updatedNationality = await nationalitySettings.findByIdAndUpdate(
      id,
      { nationality },
      { new: true }
    );

    if (!updatedNationality) {
      return res.status(404).json({ message: 'Nationality not found' });
    }

    res.status(200).json({ message: 'Nationality updated successfully', data: updatedNationality });
  } catch (error) {
    console.error(`PUT /nationality-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error updating nationality' });
  }
});

export default router;
