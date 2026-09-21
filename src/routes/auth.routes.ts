import { Router } from "express";

import { validate } from "../middlewares/validate.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { signupSchema, loginSchema, updateProfileSchema } from "../utils/zod.schemas.js";
import { signupController, loginController } from "../controllers/auth.controller.js";
import { getProfileController, updateProfileController } from "../controllers/profile.controller.js";

const authRouter = Router();

// POST /api/auth/signup
authRouter.post("/signup", validate(signupSchema), signupController);

// POST /api/auth/login
authRouter.post("/login", validate(loginSchema), loginController);

// GET /api/auth/profile  (protected)
authRouter.get("/profile", verifyToken, getProfileController);

// PUT /api/auth/profile  (protected)
authRouter.put("/profile", verifyToken, validate(updateProfileSchema), updateProfileController);

export default authRouter;

