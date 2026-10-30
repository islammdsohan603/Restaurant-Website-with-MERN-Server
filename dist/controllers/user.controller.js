import bcrypt from "bcryptjs";
import { signupSchema } from "../schemas/user.schema.js";
import { findUserByEmail, createUser, getAllUsers, } from "../models/user.model.js";
// Create User
export const signupUser = async (req, res) => {
    try {
        // Validate user data
        const validation = signupSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({
                success: false,
                message: "Validation Failed",
                errors: validation.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
            return;
        }
        const userData = validation.data;
        // Check existing user
        const existing = await findUserByEmail(userData.email);
        if (existing) {
            res.status(409).json({
                success: false,
                message: "Email already registered",
            });
            return;
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        // Create user
        const user = await createUser({
            ...userData,
            password: hashedPassword,
        });
        // Remove password from response
        const { password, ...safeUser } = user;
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: safeUser,
        });
    }
    catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
// Get All Users
export const getUserData = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            totalUsers: users.length,
            data: users,
        });
    }
    catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};
