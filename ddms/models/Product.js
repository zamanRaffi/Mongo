import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
	name: { type: String, required: true },
	sku: { type: String },
	category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
	price: { type: Number, default: 0 },
	quantity: { type: Number, default: 0 },
	description: { type: String },
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);

