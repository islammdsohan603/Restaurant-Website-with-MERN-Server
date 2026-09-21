import { z } from "zod";

// ─── Signup Schema ────────────────────────────────────────────────────────────

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name must be 80 characters or fewer")
      .trim(),

    email: z
      .string()
      .email("Please enter a valid email address")
      .trim(),

    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be 15 digits or fewer")
      .regex(/^[0-9+\-\s()]+$/, "Phone number can only contain digits, +, -, spaces, and parentheses")
      .trim(),

    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(200, "Address must be 200 characters or fewer")
      .trim(),

    currentAddress: z
      .string()
      .min(5, "Current address must be at least 5 characters")
      .max(200, "Current address must be 200 characters or fewer")
      .trim(),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(128, "Password must be 128 characters or fewer"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Login Schema ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .trim(),

  password: z
    .string()
    .min(1, "Password is required"),
});

// ─── Update Profile Schema ────────────────────────────────────────────────────

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name must be 80 characters or fewer")
      .trim()
      .optional(),

    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be 15 digits or fewer")
      .regex(/^[0-9+\-\s()]+$/, "Phone number can only contain digits, +, -, spaces, and parentheses")
      .trim()
      .optional(),

    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(200, "Address must be 200 characters or fewer")
      .trim()
      .optional(),

    currentAddress: z
      .string()
      .min(5, "Current address must be at least 5 characters")
      .max(200, "Current address must be 200 characters or fewer")
      .trim()
      .optional(),

    // Password change fields — all optional, but if any supplied they must all be valid
    currentPassword: z.string().optional(),

    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .max(128, "New password must be 128 characters or fewer")
      .optional(),

    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If any password field is given, all three must be present
      const anyPw = data.currentPassword || data.newPassword || data.confirmNewPassword;
      if (!anyPw) return true;
      return Boolean(data.currentPassword && data.newPassword && data.confirmNewPassword);
    },
    {
      message: "All three password fields are required to change your password",
      path: ["currentPassword"],
    }
  )
  .refine(
    (data) => {
      if (!data.newPassword || !data.confirmNewPassword) return true;
      return data.newPassword === data.confirmNewPassword;
    },
    {
      message: "New passwords do not match",
      path: ["confirmNewPassword"],
    }
  );

// ─── Types ────────────────────────────────────────────────────────────────────

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
