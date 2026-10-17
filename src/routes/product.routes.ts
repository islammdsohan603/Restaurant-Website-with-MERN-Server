import { Router } from "express";
import { postPorducts } from "../controllers/product.controller.js";

const router = Router();

// post for new products
router.post("/products", postPorducts);

export default router;
