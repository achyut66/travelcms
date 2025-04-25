import express from 'express';
import  languageSettings  from '../../models/Settings/Language.js';

const router = express.Router();

// Create Nationality
// Inside your route handler
router.post('/language-register', async (req, res) => {
    console.log("Request body:", req.body);  // Log the full request body
  
    const { language } = req.body;
  
    if (!language || typeof language !== 'string') {
      return res.status(400).json({ message: 'language is required and must be a string' });
    }
  
    try {
      const newNationality = new languageSettings({ language });
      await newNationality.save();
      res.status(201).json({ message: 'Language added successfully', data: newNationality });
    } catch (error) {
      console.error('POST /language-register error:', error);
      res.status(500).json({ message: 'Something went wrong while saving language' });
    }
  });
  

// Get All Nationalities
router.get('/language-data', async (req, res) => {
  try {
    const nationalities = await languageSettings.find().sort({ language: 1 }); // optional: sort alphabetically
    res.status(200).json(nationalities);
  } catch (error) {
    console.error('GET /language-data error:', error);
    res.status(500).json({ message: 'Unable to fetch visit language' });
  }
});

// Get Nationality by ID
router.get('/language-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const nationality = await languageSettings.findById(id);

    if (!nationality) {
      return res.status(404).json({ message: 'visit language not found' });
    }

    res.status(200).json(nationality);
  } catch (error) {
    console.error(`GET /language-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error retrieving visit language' });
  }
});
// delete
router.delete('/language-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPurpose = await languageSettings.findByIdAndDelete(id);

    if (!deletedPurpose) {
      return res.status(404).json({ message: 'Visit purpose not found' });
    }

    res.status(200).json({ message: 'Visit purpose deleted successfully' });
  } catch (error) {
    console.error(`DELETE /language-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error deleting visit purpose' });
  }
});

// Update Nationality by ID
router.put('/language-profile/:id', async (req, res) => {
  const { id } = req.params;
  const { language } = req.body;

  if (!language || typeof language !== 'string') {
    return res.status(400).json({ message: 'visit language is required and must be a string' });
  }

  try {
    const updatedNationality = await languageSettings.findByIdAndUpdate(
      id,
      { language },
      { new: true }
    );

    if (!updatedNationality) {
      return res.status(404).json({ message: 'visit language not found' });
    }

    res.status(200).json({ message: 'visit language updated successfully', data: updatedNationality });
  } catch (error) {
    console.error(`PUT /language-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error updating visit status' });
  }
});

export default router;
