import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});

const startServer = async () => {
  app.listen(process.env.PORT || 5000);
};

startServer();
