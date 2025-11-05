import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/router"
import cookieParser from "cookie-parser";
dotenv.config();


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(router);
app.get("/", (req, res) => {
  res.send("Hello from TypeScript + Express!");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
