import express from "express";
import cors from "cors";

import userRoutes from "./routers/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Restaurant Backend Server is Running!",
  });
});

// User Routes

app.use("/api/users", userRoutes);

export default app;
