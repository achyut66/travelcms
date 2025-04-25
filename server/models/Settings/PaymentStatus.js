import mongoose from 'mongoose';

const paymentStatusSchema = new mongoose.Schema({
  status: { type: String, required: true },
  
},{ timestamps: true });

const paymentStatusSettings = mongoose.model('settings_payment_status', paymentStatusSchema);
export default paymentStatusSettings;
