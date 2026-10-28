import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Restaurant Backend Server is Running!",
    });
});
export default app;
