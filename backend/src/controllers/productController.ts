import { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from '../models/Product';
import mongoose from 'mongoose';

export const getProducts = async (req: Request , res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    next(error);
  }
}

export const searchProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Search query:', req.query.name); 
    const { name } = req.query;
    const products = name
      ? await Product.find({ name: { $regex: name, $options: "i" } })
      : await Product.find();

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction):Promise <any> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction):Promise <any> => {
try{
  const { inStock } = req.body;

  if (typeof inStock !== "boolean"){
    return res.status(400).json({ message: "Invalid inStock value must be booolean" });
  }

  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const updateProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { inStock },
    { new: true }
  );
  if (!updateProduct) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.status(200).json(updateProduct);
} catch (error) {
  next(error);
};
};

export const getProductByID = async (req: Request, res: Response, next: NextFunction):Promise <any> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const addProduct = async (req: Request, res: Response, next: NextFunction):Promise <any> => {
  try {
    const { name, price, category, inStock, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required." });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const product: IProduct = new Product({
      name,
      price: parseFloat(price),
      category,
      inStock: inStock === "true",
      description,
      image: imageUrl, 
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};
