import { Router } from "express";
import { signupUser, getUserData } from "../controllers/user.controller.js";
const router = Router();
// user signup
router.post("/signup", signupUser);
// get all users
router.get("/", getUserData);
export default router;
