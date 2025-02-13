import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import mongoose from 'mongoose';

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find().populate('items.productId');
    res.status(200).json(orders);
  } catch (error) {
    next(error); 
  }
};

export const getOrderByID = async (req: Request, res: Response, next: NextFunction):Promise <any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    
    const order = await Order.findById(id).populate('items.productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error); 
  }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, items, totalPrice } = req.body;
    const newOrder = new Order({ email, items, totalPrice });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    next(error); 
  }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error); 
  }
};

export const getOrderByEmail = async (req: Request, res: Response, next: NextFunction):Promise <any> => {
  try {
    const {email} = req.params;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const order = await Order.find({ email }).populate('items.productId');
    res.status(200).json(order);
  } catch (error) {
    next(error); 
  }
};

export const OrderStatus = async (req: Request, res: Response, next: NextFunction):Promise <any> => {
  try {
    const { id } = req.params;
    const { status } =req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID'})
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder){
      return res.status(404).json({message: 'Order not found'})
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction):Promise <any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    next(error); 
  }
};

