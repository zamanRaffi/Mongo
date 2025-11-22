import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema({
	name: { type: String, required: true },
	contact: { type: String },
	phone: { type: String },
	email: { type: String },
});

export default mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema);

