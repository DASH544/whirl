import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser"
import { connectionDb } from "./db/db.js";
import cloudinary from "cloudinary";
//using middlewares

dotenv.config();
const app = express();
cloudinary.v2.config({
  cloud_name: process.env.Cloudinary_Cloud_Name,
  api_key: process.env.Cloudinary_Api,
  api_secret: process.env.Cloudinary_Secret,
});

app.use(express.json());
app.use(cookieParser())
const port = process.env.PORT;
app.get("/", (req, res) => {
  res.send("Hello");
});
//import routes
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import authRoutes from "./routes/authRoutes.js";

//using routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

app.listen(port, () => {
  console.log(`Server is Runing on http://localhost:${port} `);
  connectionDb();
});
