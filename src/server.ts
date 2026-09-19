import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./db/database.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
  });
});

// Start Server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} 🚀`);
    });
  } catch (error) {
    console.error("Failed to start server ❌", error);
    process.exit(1);
  }
};

startServer();
