import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  method: { type: String, required: true },
  
},{ timestamps: true });

const paymentMethodSettings = mongoose.model('settings_payment_method', paymentMethodSchema);
export default paymentMethodSettings;
