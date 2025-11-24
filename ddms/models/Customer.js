import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required.'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true, // Allows null/undefined emails if not required
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  totalPurchases: { // Useful for loyalty tracking
    type: Number,
    default: 0,
  },
  lastPurchaseDate: {
    type: Date,
    default: null,
  }
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema);

