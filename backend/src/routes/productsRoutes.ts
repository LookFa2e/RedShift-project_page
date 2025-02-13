import express from "express";
import { upload } from "../config/multer";
import { getProductRanking } from "../controllers/dashboardController";
import { getProducts, searchProducts, deleteProduct, updateProduct, getProductByID ,addProduct } from "../controllers/productController";

const router = express.Router();

router.get('/ranking', getProductRanking);
router.post("/", upload.single("image"), addProduct);
router.get("/", getProducts);
router.get("/search", searchProducts);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);
router.get("/:id", getProductByID);


export default router;