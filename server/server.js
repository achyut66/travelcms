import session from "express-session";
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { API_BASE_URL } from "../client/src/config.js";

// Route Imports
import authRoutes from './routes/auth.js';
import companyProfile from './routes/Settings/companyprofile.js';
import nationalitySettings from './routes/Settings/nationality.js';
import packageSettings from './routes/Settings/package.js';
import paymentStatusSettings from './routes/Settings/paymentstatus.js';
import paymentMethodSettings from './routes/Settings/paymentmethod.js';
import visitPurposeSettings from './routes/Settings/visitpurpose.js';
import languageSettings from './routes/Settings/language.js';
import bookings from './routes/Classification/booking.js';
import flightbookings from './routes/Classification/flightbooking.js';
import protectedRoutes from './routes/protectedRoute.js';
import guideSettings from "./routes/Settings/guide.js";
import bookingAssistant from "./routes/Classification/assistantdetails.js";
import bookingCompleteProfile from './routes/Classification/bookingcomplete.js';
import bookingCancel from './routes/Classification/bookingcancel.js';
import transportationSettings from "./routes/Settings/transportation.js";
import flightSettings from "./routes/Settings/flight.js";
import itenerySettings from './routes/Classification/itenery.js';
import assignPickup from './routes/Classification/assignpickup.js';
import extrasSettings from './routes/Classification/extras.js';
import receiptProfile from "./routes/Classification/receiptprint.js";
import equipmentDetails from "./routes/Inventory/equipment.js";
import equipDamageDetails from "./routes/Inventory/equipmentDamage.js";


dotenv.config();
const app = express();

// __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173'], // Allow requests from React frontend
  credentials: true,
}));

app.use(express.json()); // ✅ Handles JSON data
app.use(express.urlencoded({ extended: true })); // ✅ Handles form data

app.use(session({
  secret: "your-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    sameSite: 'lax',
  },
}));

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// API Routes
app.use("/api", authRoutes);
app.use("/api", companyProfile);
app.use("/api", nationalitySettings);
app.use("/api", packageSettings);
app.use("/api", paymentStatusSettings);
app.use("/api", paymentMethodSettings);
app.use("/api", visitPurposeSettings);
app.use("/api", languageSettings);
app.use("/api", bookings);
app.use("/api", flightbookings);
app.use("/api", protectedRoutes);
app.use("/api", guideSettings);
app.use("/api", bookingAssistant);
app.use("/api", bookingCompleteProfile);
app.use("/api", bookingCancel);
app.use("/api", transportationSettings);
app.use("/api", flightSettings);
app.use("/api", itenerySettings);
app.use("/api", assignPickup);
app.use("/api", extrasSettings);
app.use("/api", receiptProfile);
app.use("/api", equipmentDetails);
app.use("/api", equipDamageDetails);

// Serve static files (uploads/images etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
