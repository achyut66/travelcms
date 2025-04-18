import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import companyProfile from './routes/companyprofile.js';
import session from 'express-session';
import path from 'path';  // Import the path module
import { fileURLToPath } from 'url';  // Import fileURLToPath from the url module

dotenv.config();
const app = express();

// Use import.meta.url to get the directory name equivalent to __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);  // Get the current file path
const __dirname = path.dirname(__filename);  // Get the current directory path

app.use(cors({
  origin: 'http://localhost:5173', // frontend port
  credentials: true               // ✅ Allow credentials (cookies/sessions)
}));

app.use(express.json());

app.use(session({
  secret: 'secret-key',            // change this in prod
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,                 // true in production with HTTPS
    httpOnly: true
  }
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Simple route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api", authRoutes);
app.use("/api", companyProfile);
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
