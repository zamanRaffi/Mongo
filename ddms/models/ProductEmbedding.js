import mongoose from 'mongoose';

const ProductEmbeddingSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  vector: { type: [Number], required: true },
  metadata: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ProductEmbedding || mongoose.model('ProductEmbedding', ProductEmbeddingSchema);
