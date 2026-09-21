import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.model.js";
import type { SignupInput, LoginInput } from "../utils/zod.schemas.js";

const SALT_ROUNDS = 12;

// ─── Helper: Sign JWT ─────────────────────────────────────────────────────────

const signToken = (userId: string, email: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined in environment");

  return jwt.sign({ id: userId, email }, secret, { expiresIn: "7d" });
};

// ─── Signup Controller ────────────────────────────────────────────────────────

export const signupController = async (
  req: Request<object, object, SignupInput>,
  res: Response
): Promise<void> => {
  try {
    const { name, email, phone, address, currentAddress, password } = req.body;

    // Check for duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
        errors: [{ field: "email", message: "Email is already registered" }],
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      address,
      currentAddress,
      password: hashedPassword,
    });

    // Issue JWT
    const token = signToken(String(user._id), user.email);

    res.status(201).json({
      success: true,
      message: "Account created successfully! Please log in.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        currentAddress: user.currentAddress,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// ─── Login Controller ─────────────────────────────────────────────────────────

export const loginController = async (
  req: Request<object, object, LoginInput>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email (include password field)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
        errors: [{ field: "email", message: "No account found with this email" }],
      });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
        errors: [{ field: "password", message: "Incorrect password" }],
      });
      return;
    }

    // Issue JWT
    const token = signToken(String(user._id), user.email);

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        currentAddress: user.currentAddress,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
