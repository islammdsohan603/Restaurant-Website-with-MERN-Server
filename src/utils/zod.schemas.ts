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

// ─── Types ────────────────────────────────────────────────────────────────────

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
