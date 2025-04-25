import express from 'express';
import  paymentMethodSettings  from '../../models/Settings/PaymentMethod.js';

const router = express.Router();

// Create Nationality
// Inside your route handler
router.post('/payment-method-register', async (req, res) => {
    console.log("Request body:", req.body);  // Log the full request body
  
    const { method } = req.body;
  
    if (!method || typeof method !== 'string') {
      return res.status(400).json({ message: 'Status is required and must be a string' });
    }
  
    try {
      const newNationality = new paymentMethodSettings({ method });
      await newNationality.save();
      res.status(201).json({ message: 'Status added successfully', data: newNationality });
    } catch (error) {
      console.error('POST /payment-method-register error:', error);
      res.status(500).json({ message: 'Something went wrong while saving package' });
    }
  });
  

// Get All Nationalities
router.get('/payment-method-data', async (req, res) => {
  try {
    const nationalities = await paymentMethodSettings.find().sort({ method: 1 }); // optional: sort alphabetically
    res.status(200).json(nationalities);
  } catch (error) {
    console.error('GET /payment-method-data error:', error);
    res.status(500).json({ message: 'Unable to fetch payment method' });
  }
});

// Get Nationality by ID
router.get('/payment-method-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const nationality = await paymentMethodSettings.findById(id);

    if (!nationality) {
      return res.status(404).json({ message: 'payment method not found' });
    }

    res.status(200).json(nationality);
  } catch (error) {
    console.error(`GET /payment-method-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error retrieving payment method' });
  }
});
// delete
router.delete('/payment-method-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPurpose = await paymentMethodSettings.findByIdAndDelete(id);

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
router.put('/payment-method-profile/:id', async (req, res) => {
  const { id } = req.params;
  const { method } = req.body;

  if (!method || typeof method !== 'string') {
    return res.status(400).json({ message: 'Payment method is required and must be a string' });
  }

  try {
    const updatedNationality = await paymentMethodSettings.findByIdAndUpdate(
      id,
      { method },
      { new: true }
    );

    if (!updatedNationality) {
      return res.status(404).json({ message: 'payment method not found' });
    }

    res.status(200).json({ message: 'Payment Method updated successfully', data: updatedNationality });
  } catch (error) {
    console.error(`PUT /payment-method-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error updating payment status' });
  }
});

export default router;
