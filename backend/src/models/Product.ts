import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
  image: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  inStock: { type: Boolean, required: true },
  image: {type: String, require: true},
}, {
  timestamps: true, 
});

export default mongoose.model<IProduct>('Product', ProductSchema);
