import express from 'express';
import  transportationSettings  from '../../models/Settings/Transportation.js';

const router = express.Router();

// Create Nationality
// Inside your route handler
router.post('/vehicle-register', async (req, res) => {
    // console.log("Request body:", req.body);  // Log the full request body
    const { company_name,vehicle_type,vehicle_number, is_available = 1 } = req.body;
  
    if (!vehicle_type || !vehicle_number || !company_name) {
      return res.status(400).json({ message: 'Transportation is required' });
    }

    // if (!vehicle_number || typeof vehicle_number !== 'string') {
    //     return res.status(400).json({ message: 'Transportation is required and must be a string' });
    //   }
    // const is_available =1;
    try {
      const newNationality = new transportationSettings({ vehicle_type,vehicle_number,is_available,company_name });
      await newNationality.save();
      res.status(201).json({ message: 'Transportation added successfully', data: newNationality });
    } catch (error) {
      console.error('POST /transportation-register error:', error);
      res.status(500).json({ message: 'Something went wrong while saving package' });
    }
  });
  

// Get All Nationalities
router.get('/vehicle-data-1', async (req, res) => {
  try {
    const availablevehicle = await transportationSettings.find({is_available: "1"}); 
    res.status(200).json(availablevehicle);
  } catch (error) {
    console.error('GET /transportation-data error:', error);
    res.status(500).json({ message: 'Unable to fetch Transportation' });
  }
});
router.get('/vehicle-data', async (req, res) => {
  try {
    const availablevehicle = await transportationSettings.find(); 
    res.status(200).json(availablevehicle);
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
// update if snet for maintainance
router.get('/vehicle-status/:id', async (req,res) => {
  const {id} = req.params;
  try {
    const nextdata = await transportationSettings.findByIdAndUpdate(id,{is_available: "0", new:true});
    res.status(200).json({message:"Sent For Maintainance."});
  } catch (error) {
    res.status(500).json({message:"Error !! Cant Operate."})
  }
});
// return from maintainnace
router.get('/vehicle-status-return/:id', async (req,res) => {
  const {id} = req.params;
  try {
    const nextdata = await transportationSettings.findByIdAndUpdate(id,{is_available: "1", new:true});
    res.status(200).json({message:"Return From Maintainance."});
  } catch (error) {
    res.status(500).json({message:"Error !! Cant Operate."})
  }
});

// Update Nationality by ID
router.put('/vehicle-profile/:id', async (req, res) => {
  const { id } = req.params;
  const { vehicle_type } = req.body;
  const { vehicle_number } = req.body;
  const { company_name } = req.body;
  const is_available = req.body.is_available !== undefined ? req.body.is_available : 1;

  if (!vehicle_type || !vehicle_number || !company_name || !is_available ) {
    return res.status(400).json({ message: 'Transportation is required and must be a string' });
  }
  // if (!vehicle_number || typeof vehicle_number !== 'string') {
  //   return res.status(400).json({ message: 'Transportation is required and must be a string' });
  // }

  try {
    const updatedNationality = await transportationSettings.findByIdAndUpdate(
      id,
      // if(!updatedNationality && (
      //   updatedNationality.map(data,idx){
      //   isavaillable = data.is_available;
      //   }
      // );
        
      { vehicle_type, vehicle_number,company_name, is_available },
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
