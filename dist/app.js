import express from "express";
import cors from "cors";
import productRouter from "./routes/product.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
// route
app.use("", productRouter);
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Restaurant API is running",
    });
});
export default app;
