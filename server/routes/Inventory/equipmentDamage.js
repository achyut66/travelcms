import express from 'express';
import  equipmentDamageDetails  from '../../models/Inventory/DamageEquip.js';
import equipmentDetails from '../../models/Inventory/Equipment.js';

const router = express.Router();

// Create Nationality
// Inside your route handler
router.post('/equipment-damage-register', async (req, res) => {
  try {
    const { equip_id, no_of_items, reason } = req.body;

    if (!equip_id || !no_of_items || !reason) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newEquip = new equipmentDamageDetails({
      equip_id,
      no_of_items,
      reason,
    });
    await newEquip.save();

    const detailsBefore = await equipmentDetails.findById(equip_id);

const prevDamaged = Number(detailsBefore.damaged) || 0;
const addedDamage = Number(no_of_items);
const availabledata = Number(detailsBefore.number - addedDamage);

// if(!prevDamaged){
// const availabledata = Number(detailsBefore.number - addedDamage);
// } else {
//   const availabledata = detailsBefore.number;
// }

if (isNaN(addedDamage)) {
  return res.status(400).json({ message: "Invalid number of damaged items." });
}

const totalDamaged = prevDamaged + addedDamage;


    let availability = "1"; // Available
    if (totalDamaged >= detailsBefore.number) {
      availability = "2"; // Fully damaged
    }

    const updatedEquip = await equipmentDetails.findByIdAndUpdate(
      equip_id,
      {
        damaged: totalDamaged,
        is_available: availability,
        available: availabledata,
      },
      { new: true }
    );

    res.status(201).json({
      message: "Equipment damage saved and equipment updated successfully.",
      data: {
        damage: newEquip,
        updatedEquipment: updatedEquip,
      },
    });

  } catch (error) {
    console.error("Error in damage register route:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

  // Get All Nationalities
 // Fetch itineraries grouped by package_name
 router.get('/equipment-data', async (req, res) => {
    try {
      const extras = await equipmentDamageDetails.find();
      res.status(200).json(extras); // Send the updated data with company names
    } catch (error) {
      console.error('GET /equipment-data error:', error);
      res.status(500).json({ message: 'Unable to fetch equipment data' });
    }
  });
// delete
router.delete('/equipment-profile/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedItenery = await equipmentDamageDetails.findByIdAndDelete(id);
      if (!deletedItenery) {
        return res.status(404).json({ message: 'Equipment not found' });
      }
      res.status(200).json({ 
        message: 'Equipment deleted successfully', 
        deleted: deletedItenery 
      });
    } catch (error) {
      console.error(`DELETE /equipment-profile/${id} error:`, error);
      res.status(500).json({ message: 'Error deleting itenery' });
    }
  });
// edit modal
router.get('/equipment-data-id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const editData = await equipmentDamageDetails.findById(id);
    if (!editData) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    return res.status(200).json({ data: editData }); // always return the data
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return res.status(500).json({ message: "Error fetching data" });
  }
});
// Update Extra by ID
router.put('/equipment-update/:id', async (req, res) => {
    const { id } = req.params;
    const { equipment_name,number,is_available } = req.body;
  
    // Validate required fields
    if (!equipment_name || !number || !is_available) {
      return res.status(400).json({ message: "Missing required fields." });
    }
  
    try {
      const updatedExtra = await equipmentDamageDetails.findByIdAndUpdate(
        id,
        {
          equipment_name,
          number,
          is_available,
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedExtra) {
        return res.status(404).json({ message: "Equipment not found." });
      }
  
      res.status(200).json({ message: "Equipment updated successfully.", data: updatedExtra });
    } catch (error) {
      console.error(`PUT /equipment-update/${id} error:`, error);
      res.status(500).json({ message: "Error updating extra." });
    }
  });
// if damage 
router.get('/check-flag/:id', async (req,res) => {
  const {id} = req.params;
  try {
    const nextdata = await equipmentDamageDetails.findByIdAndUpdate(id,{is_available: "0", new:true});
    res.status(500).json({message:"Equipment Flag Updated."});
  } catch(error) {
    res.status(200).json({message:"error fetching data"});
  }
});

export default router;
