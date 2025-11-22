import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String },
	role: { type: String },
	phone: { type: String },
});

export default mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);

