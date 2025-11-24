import connectdb from '../lib/mongodb';
import Product from '../models/Product';
import Category from '../models/Category';

export async function createOrUpdateProduct(body) {
  await connectdb();

  const obj = { ...body };
  if (!obj.category) obj.category = null;

  let product;
  if (obj.id) {
    product = await Product.findByIdAndUpdate(obj.id, obj, { new: true });
  } else {
    product = new Product(obj);
    await product.save();
  }

  // Build text to embed
  let text = `${product.name || ''} ${product.sku || ''} ${product.description || ''}`;
  if (product.category) {
    try {
      const cat = await Category.findById(product.category);
      if (cat) text += ` ${cat.name}`;
    } catch (e) {}
  }

  // // enqueue embedding job for background processing (worker will compute + upsert)
  // try {
  //   await embeddingQueue.add('index-product', { productId: String(product._id) }, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
  // } catch (err) {
  //   console.error('Failed to enqueue embedding job', product._id, err.message || err);
  // }

  return product;
}
