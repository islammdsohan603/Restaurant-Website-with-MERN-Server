import { Router } from "express";
import { getProducts, postPorducts, } from "../controllers/product.controller.js";
const router = Router();
// post for new products
router.post("/products", postPorducts);
// get products data
router.get("/getdata", getProducts);
export default router;
