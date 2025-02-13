import mongoose, { Document, Schema } from 'mongoose';

export interface OrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

interface Order extends Document {
  email: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: Date;
}

const orderSchema: Schema<Order> = new Schema(
  {
    email: { type: String, required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order = mongoose.model<Order>('Order', orderSchema);

export default Order;
