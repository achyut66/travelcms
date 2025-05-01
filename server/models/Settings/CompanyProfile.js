import mongoose from 'mongoose';

const companyProfileSchema = new mongoose.Schema({
  company_name: { type: String, required: true },
  company_address: { type: String, required: true },
  contact_person: { type: String, required: true },
  contact_number: { type: String, required: true },
  company_logo: { type: String, required: true },
  vat_no:{type:String},
  
},{ timestamps: true });

const CompanyProfile = mongoose.model('Companyprofile', companyProfileSchema);
export default CompanyProfile;
