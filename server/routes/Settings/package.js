import express from 'express';
import  packageSettings  from '../../models/Settings/Package.js';
import packageInclusionSettings from '../../models/Settings/PackageInclusion.js';
import extrasSettings from '../../models/Classification/Extras.js';

const router = express.Router();

// Create Nationality
// Inside your route handler
router.post('/package-register', async (req, res) => {
  const { package: pkg, rate, inclusion_ids, exclusion_ids } = req.body;

  if (!pkg || !rate) {
    return res.status(400).json({ message: 'Package and rate are required' });
  }

  try {
    const newPackageSettings = new packageSettings({
      package: pkg,
      rate,
      inclusion_ids,
      exclusion_ids,
    });
    await newPackageSettings.save();

    const packageId = newPackageSettings._id.toString(); // Get the inserted ID
    const documents = [];

    const maxLength = Math.max(
      inclusion_ids?.length || 0,
      exclusion_ids?.length || 0
    );

    for (let i = 0; i < maxLength; i++) {
      documents.push({
        package_id: packageId,
        package_name: pkg,
        inclusions_ids: inclusion_ids?.[i] || null,
        exclusions_ids: exclusion_ids?.[i] || null,
      });
    }

    await packageInclusionSettings.insertMany(documents);

    res.status(201).json({
      message: 'Package added successfully!',
      data: newPackageSettings,
    });
  } catch (error) {
    console.error('POST /package-register error:', error);
    res.status(500).json({ message: 'Something went wrong while saving package' });
  }
});
  
// Get All Nationalities
router.get('/package-data', async (req, res) => {
  try {
    const nationalities = await packageSettings.find(); // optional: sort alphabetically
    res.status(200).json(nationalities);
  } catch (error) {
    console.error('GET /package-data error:', error);
    res.status(500).json({ message: 'Unable to fetch package' });
  }
});
// delete
router.delete('/package-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPurpose = await packageSettings.findByIdAndDelete(id);

    if (!deletedPurpose) {
      return res.status(404).json({ message: 'Visit purpose not found' });
    }
    res.status(200).json({ message: 'Visit purpose deleted successfully !!!' });
  } catch (error) {
    console.error(`DELETE /delete-purpose-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error deleting visit purpose' });
  }
});
// Get Nationality by ID
router.get('/package-profile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const nationality = await packageSettings.findById(id);

    if (!nationality) {
      return res.status(404).json({ message: 'package not found' });
    }

    res.status(200).json(nationality);
  } catch (error) {
    console.error(`GET /package-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error retrieving nationality' });
  }
});

// get rate by package_name

router.get('/get-rate-by-package/:package_name', async (req, res) => {
  const { package_name } = req.params; // Corrected parameter name
  try {
    const response = await packageSettings.findOne({ package: package_name }); // Use package_name instead of pkg
    if (!response) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json(response);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Nationality by ID
router.put('/package-profile/:id', async (req, res) => {
  const { id } = req.params;
  const { package: pkg, rate, inclusion_ids, exclusion_ids } = req.body;

  if (!pkg) {
    return res.status(400).json({ message: 'Package is required' });
  }

  try {
    const updatedPackage = await packageSettings.findByIdAndUpdate(
      id,
      { package: pkg, rate, inclusion_ids, exclusion_ids },
      { new: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await packageInclusionSettings.deleteMany({ package_name: pkg });

    const documents = [];

    if (Array.isArray(inclusion_ids) || Array.isArray(exclusion_ids)) {
      const maxLength = Math.max(
        inclusion_ids?.length || 0,
        exclusion_ids?.length || 0
      );

      for (let i = 0; i < maxLength; i++) {
        documents.push({
          package_id: id,
          package_name: pkg,
          inclusions_ids: inclusion_ids?.[i] || null,
          exclusions_ids: exclusion_ids?.[i] || null,
        });
      }

      await packageInclusionSettings.insertMany(documents);
    }

    res.status(200).json({
      message: 'Package updated successfully!',
      data: updatedPackage,
    });

  } catch (error) {
    console.error(`PUT /package-profile/${id} error:`, error);
    res.status(500).json({ message: 'Error updating package' });
  }
});


export default router;
