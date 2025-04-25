import express from 'express';
import  visitPurposeSettings  from '../../models/Settings/VisitPurpose.js';

const router = express.Router();

// Create Nationality
// Inside your route handler
router.post('/visit-purpose-register', async (req, res) => {
    console.log("Request body:", req.body);  // Log the full request body
  
    const { purpose } = req.body;
  
    if (!purpose || typeof purpose !== 'string') {
      return res.status(400).json({ message: 'Status is required and must be a string' });
    }
  
    try {
      const newNationality = new visitPurposeSettings({ purpose });
      await newNationality.save();
      res.status(201).json({ message: 'Status added successfully', data: newNationality });
    } catch (error) {
      console.error('POST /visit-purpose-register error:', error);
      res.status(500).json({ message: 'Something went wrong while saving package' });
    }
  });
  

// Get All Nationalities
router.get('/visit-purpose-data', async (req, res) => {
  try {
    const nationalities = await visitPurposeSettings.find().sort({ purpose: 1 }); // optional: sort alphabetically
    res.status(200).json(nationalities);
  } catch (error) {
    console.error('GET /visit-purpose-data error:', error);
    res.status(500).json({ message: 'Unable to fetch visit purpose' });
  }
});

// Get Nationality by ID
router.get('/visit-purpose-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const nationality = await visitPurposeSettings.findById(id);

    if (!nationality) {
      return res.status(404).json({ message: 'visit purpose not found' });
    }

    res.status(200).json(nationality);
  } catch (error) {
    console.error(`GET /visit-purpose-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error retrieving visit purpose' });
  }
});
router.delete('/visit-purpose-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPurpose = await visitPurposeSettings.findByIdAndDelete(id);

    if (!deletedPurpose) {
      return res.status(404).json({ message: 'Visit purpose not found' });
    }

    res.status(200).json({ message: 'Visit purpose deleted successfully' });
  } catch (error) {
    console.error(`DELETE /delete-purpose-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error deleting visit purpose' });
  }
});


// Update Nationality by ID
router.put('/visit-purpose-profile/:id', async (req, res) => {
  const { id } = req.params;
  const { purpose } = req.body;

  if (!purpose || typeof purpose !== 'string') {
    return res.status(400).json({ message: 'visit purpose is required and must be a string' });
  }

  try {
    const updatedNationality = await visitPurposeSettings.findByIdAndUpdate(
      id,
      { purpose },
      { new: true }
    );

    if (!updatedNationality) {
      return res.status(404).json({ message: 'visit purpose not found' });
    }

    res.status(200).json({ message: 'visit purpose updated successfully', data: updatedNationality });
  } catch (error) {
    console.error(`PUT /visit-purpose-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error updating visit status' });
  }
});

export default router;
