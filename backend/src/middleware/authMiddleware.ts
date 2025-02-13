import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/userModel"; 

export interface AuthenticatedRequest extends Request {
  user?: IUser; 
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string; exp: number };
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; 

      const now = Date.now() / 1000;
      const expirationTime = decoded.exp;

      if (expirationTime && expirationTime - now < 43200) {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
          return res.status(401).json({ message: "No refresh token available" });
        }

        try {
          const refreshDecoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };
          const newAccessToken = jwt.sign({ id: refreshDecoded.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

          res.cookie("accessToken", newAccessToken, { httpOnly: true, maxAge: 86400 * 1000 });

        } catch (error) {
          console.error("Refresh token verification failed:", error);
          return res.status(401).json({ message: "Invalid refresh token" });
        }
      }

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };
        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

        res.cookie("accessToken", newAccessToken, { httpOnly: true, maxAge: 86400 * 1000 });
        return next();
      } catch (error) {
        console.error("Refresh token verification failed:", error);
        return res.status(401).json({ message: "Invalid or expired refresh token" });
      }
    }

    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const admin = (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
