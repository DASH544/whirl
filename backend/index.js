import dotenv from "dotenv";
import express from "express";
import { connectionDb } from "./db/db.js";

dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT;
app.get("/", (req, res) => {
  res.send("Hello");
});
//import routes
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import authRoutes from "./routes/authRoutes.js"

//using routes
app.use("/api/user",userRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/post",postRoutes)

app.listen(port, () => {
  console.log(`Server is Runing on http://localhost:${port} `);
  connectionDb();
});
