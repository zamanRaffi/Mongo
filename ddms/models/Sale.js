import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
	product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
	quantity: { type: Number, default: 1 },
	total: { type: Number, default: 0 },
	date: { type: Date, default: Date.now },
});

export default mongoose.models.Sale || mongoose.model("Sale", SaleSchema);

