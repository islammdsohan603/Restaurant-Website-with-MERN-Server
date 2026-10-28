import type { Request, Response } from "express";

import bcrypt from "bcryptjs";

import { signupSchema } from "../schemas/user.schema.js";

import { findUserByEmail, createUser } from "../models/user.model.js";

export const signupUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validation = signupSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join(""),
          message: issue.message,
        })),
      });

      return;
    }

    const userData = validation.data;

    // check existing user

    const existing = await findUserByEmail(userData.email);

    if (existing) {
      res.status(400).json({
        success: false,
        message: "Email already registered",
      });

      return;
    }

    // hash password

    const hasPassword = await bcrypt.hash(userData.password, 12);

    // create user

    const user = await createUser({
      ...userData,
      password: hasPassword,
    });
    // remode password from response

    const { password, ...safeUser } = user;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: safeUser,
    });
  } catch (error) {
    console.error("Signup Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
