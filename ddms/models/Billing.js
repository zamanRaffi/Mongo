import mongoose from "mongoose";

const BillingSchema = new mongoose.Schema({
	sale: { type: mongoose.Schema.Types.ObjectId, ref: "Sale" },
	amount: { type: Number, default: 0 },
	paid: { type: Boolean, default: false },
	date: { type: Date, default: Date.now },
});

export default mongoose.models.Billing || mongoose.model("Billing", BillingSchema);

