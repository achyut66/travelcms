import express from 'express';
import  guideSettings  from '../../models/Settings/Guide.js';

const router = express.Router();

// Create Nationality
// Inside your route handler
router.post('/guide-register', async (req, res) => {
    // console.log("Request body:", req.body);  // Log the full request body
  
    const { contact_name } = req.body;
    const { flag } = req.body;
  
    if (!contact_name || typeof contact_name !== 'string') {
      return res.status(400).json({ message: 'guide is required and must be a string' });
    }
    if (!flag || typeof flag !== 'string') {
        return res.status(400).json({ message: 'guide is required and must be a string' });
      }
  
    try {
      const newNationality = new guideSettings({ contact_name,flag });
      await newNationality.save();
      res.status(201).json({ message: 'guide added successfully', data: newNationality });
    } catch (error) {
      console.error('POST /guide-register error:', error);
      res.status(500).json({ message: 'Something went wrong while saving guide' });
    }
  });
  

// Get All Nationalities
router.get('/guide-data', async (req, res) => {
  try {
    const nationalities = await guideSettings.find().sort({ contact_name: 1 }); // optional: sort alphabetically
    res.status(200).json(nationalities);
  } catch (error) {
    console.error('GET /guide-data error:', error);
    res.status(500).json({ message: 'Unable to fetch visit guide' });
  }
});

// Get Nationality by ID
router.get('/guide-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const nationality = await guideSettings.findById(id);

    if (!nationality) {
      return res.status(404).json({ message: 'visit guide not found' });
    }
    res.status(200).json(nationality);
  } catch (error) {
    console.error(`GET /guide-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error retrieving visit guide' });
  }
});
// delete
router.delete('/guide-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPurpose = await guideSettings.findByIdAndDelete(id);
    if (!deletedPurpose) {
      return res.status(404).json({ message: 'Guuide not found' });
    }

    res.status(200).json({ message: 'Guide/Potter deleted successfully' });
  } catch (error) {
    console.error(`DELETE /guide-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error deleting visit purpose' });
  }
});

// Update Nationality by ID
router.put('/guide-profile/:id', async (req, res) => {
  const { id } = req.params;
  const { contact_name } = req.body;
  const { flag } = req.body;

  if (!contact_name || typeof contact_name !== 'string') {
    return res.status(400).json({ message: 'visit guide is required and must be a string' });
  }
  if (!flag || typeof flag !== 'string') {
    return res.status(400).json({ message: 'visit guide is required and must be a string' });
  }

  try {
    const updatedNationality = await guideSettings.findByIdAndUpdate(
      id,
      { contact_name, flag },
      { new: true }
    );

    if (!updatedNationality) {
      return res.status(404).json({ message: 'visit guide not found' });
    }

    res.status(200).json({ message: 'visit guide updated successfully', data: updatedNationality });
  } catch (error) {
    console.error(`PUT /guide-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error updating visit status' });
  }
});

export default router;
