import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import { generateToken } from "../middleware/authHelper";

export const registerUser = async (req: Request, res: Response, next: NextFunction):Promise <any> => {
  const { email, password } = req.body;

  try {
    console.log("Incoming registration request:", { email });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: 'user',
    });
    await newUser.save();

    const token = generateToken({
      id: newUser._id.toString(), 
      email: newUser.email,
      role: newUser.role,
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction):Promise <any> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken({
      id: user._id.toString(), 
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction):Promise <any> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User deleted.' });
  } catch (error) {
    next(error);
  }
};
