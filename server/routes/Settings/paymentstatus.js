import express from 'express';
import  paymentStatusSettings  from '../../models/Settings/PaymentStatus.js';

const router = express.Router();

// Create Nationality
// Inside your route handler
router.post('/payment-status-register', async (req, res) => {
    console.log("Request body:", req.body);  // Log the full request body
  
    const { status } = req.body;
  
    if (!status || typeof status !== 'string') {
      return res.status(400).json({ message: 'Status is required and must be a string' });
    }
  
    try {
      const newNationality = new paymentStatusSettings({ status });
      await newNationality.save();
      res.status(201).json({ message: 'Status added successfully', data: newNationality });
    } catch (error) {
      console.error('POST /nationality-register error:', error);
      res.status(500).json({ message: 'Something went wrong while saving package' });
    }
  });
  

// Get All Nationalities
router.get('/payment-status-data', async (req, res) => {
  try {
    const nationalities = await paymentStatusSettings.find().sort({ status: 1 }); // optional: sort alphabetically
    res.status(200).json(nationalities);
  } catch (error) {
    console.error('GET /status-data error:', error);
    res.status(500).json({ message: 'Unable to fetch status' });
  }
});

// Get Nationality by ID
router.get('/payment-status-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const nationality = await paymentStatusSettings.findById(id);

    if (!nationality) {
      return res.status(404).json({ message: 'package not found' });
    }

    res.status(200).json(nationality);
  } catch (error) {
    console.error(`GET /payment-status-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error retrieving nationality' });
  }
});
// delete
router.delete('/payment-status-profile/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPurpose = await paymentStatusSettings.findByIdAndDelete(id);
    if (!deletedPurpose) {
      return res.status(404).json({ message: 'Visit purpose not found' });
    }
    res.status(200).json({ message: 'Status deleted successfully !!!' });
  } catch (error) {
    console.error(`DELETE /delete-purpose-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error deleting visit purpose' });
  }
});
// Update Nationality by ID
router.put('/payment-status-profile/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || typeof status !== 'string') {
    return res.status(400).json({ message: 'Package is required and must be a string' });
  }

  try {
    const updatedNationality = await paymentStatusSettings.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedNationality) {
      return res.status(404).json({ message: 'Nationality not found' });
    }

    res.status(200).json({ message: 'Package updated successfully', data: updatedNationality });
  } catch (error) {
    console.error(`PUT /payment-status-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error updating nationality' });
  }
});

export default router;
