import express from 'express';
import multer from 'multer';
import path from 'path';
import CompanyProfile from '../../models/Settings/CompanyProfile.js';

const router = express.Router();

// Set up Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
router.post('/profile-register', upload.single('company_logo'), async (req, res) => {
  const {
    company_name,
    company_address,
    contact_person,
    contact_number
  } = req.body;

  const company_logo = req.file?.filename || "";
  try {
    const comProfile = new CompanyProfile({
      company_name,
      company_address,
      contact_person,
      contact_number,
      company_logo
    });

    await comProfile.save();
    res.status(201).json({ message: 'Profile Added Successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went iiiii' });
  }
});
router.get('/profile-data', async (req, res) => {
  try {
    const profiles = await CompanyProfile.find();  // Fetch all profiles
    res.status(200).json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to fetch profiles' });
  }
});
router.get('/count-profile',async (req,res) => {
  try {
    const count = await CompanyProfile.countDocuments();
    res.status(200).json(count)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:"unable to fetch count" });
  }
});
router.get('/company-profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await CompanyProfile.findById(id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile', error });
  }
});
router.put('/company-profile/:id', upload.single('company_logo'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (req.file) {
      updateData.company_logo = req.file.filename;
    }
    const updated = await CompanyProfile.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Company profile not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating company profile', error });
  }
});
export default router;
