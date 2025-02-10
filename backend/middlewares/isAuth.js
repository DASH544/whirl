import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";
export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(400).json({ message: "Please Login First" });
    const decodedData = jwt.verify(token, process.env.JWT_SEC);
    if (!decodedData) return res.status(400).json({ message: "Token Expired" });
    req.user = await UserModel.findById(decodedData.id);
    next();
  } catch (error) {
    res.status(500).json(error.message);
  }
};
