import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./config/database";
import productRoutes from "./routes/productsRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import path from "path";
import { notFound, errorHandler } from "./middleware/errorMiddleware"; 

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: `${process.env.LOCAL}`, 
    credentials: true, 
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); 
}

app.use(helmet()); 
app.use(express.json()); 
app.use(cookieParser()); 

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); 
      res.setHeader("Access-Control-Allow-Origin", "*"); 
    },
  })
);

app.use(notFound);
app.use(errorHandler); 

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
