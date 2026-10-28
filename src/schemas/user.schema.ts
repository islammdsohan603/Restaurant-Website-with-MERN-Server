import { z } from "zod";

export const signupSchema = z.object({
  fname: z.string().trim().min(2, "Frist name must be at least 2 characters"),

  lname: z.string().trim().optional(),

  email: z.string().trim().email("Invalid email address"),

  password: z.string().min(8, "Password must b 8 characters"),

  phone: z.string().trim().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
