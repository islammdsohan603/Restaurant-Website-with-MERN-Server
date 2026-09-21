import type { Response } from "express";
import bcrypt from "bcrypt";

import User from "../models/User.model.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import type { UpdateProfileInput } from "../utils/zod.schemas.js";

const SALT_ROUNDS = 12;

// ─── Get Profile Controller ───────────────────────────────────────────────────

export const getProfileController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found. Your account may have been deleted.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        currentAddress: user.currentAddress,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

// ─── Update Profile Controller ────────────────────────────────────────────────

export const updateProfileController = async (
  req: AuthRequest & { body: UpdateProfileInput },
  res: Response
): Promise<void> => {
  try {
    const { name, phone, address, currentAddress, currentPassword, newPassword } =
      req.body;

    // Fetch user (need password for verification if changing it)
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
      return;
    }

    // Build update object
    const updates: Partial<{
      name: string;
      phone: string;
      address: string;
      currentAddress: string;
      password: string;
    }> = {};

    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (address !== undefined) updates.address = address;
    if (currentAddress !== undefined) updates.currentAddress = currentAddress;

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({
          success: false,
          message: "Current password is required to set a new one.",
          errors: [{ field: "currentPassword", message: "Current password is required" }],
        });
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        res.status(400).json({
          success: false,
          message: "Current password is incorrect.",
          errors: [{ field: "currentPassword", message: "Current password is incorrect" }],
        });
        return;
      }

      updates.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    }

    // Apply updates
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        currentAddress: updatedUser.currentAddress,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
