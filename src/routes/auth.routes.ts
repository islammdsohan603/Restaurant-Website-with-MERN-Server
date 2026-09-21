import { Router } from "express";

import { validate } from "../middlewares/validate.middleware.js";
import { signupSchema, loginSchema } from "../utils/zod.schemas.js";
import { signupController, loginController } from "../controllers/auth.controller.js";

const authRouter = Router();

// POST /api/auth/signup
authRouter.post("/signup", validate(signupSchema), signupController);

// POST /api/auth/login
authRouter.post("/login", validate(loginSchema), loginController);

export default authRouter;
