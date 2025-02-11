import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  deletePost,
  getAllPosts,
  likeUnlikePost,
  newPost,
} from "../controllers/postControllers.js";
import uploadFile from "../middlewares/multer.js";
const router = express.Router();

router.post("/new", isAuth, uploadFile, newPost);
router.delete("/:id", isAuth, deletePost);
router.get("/all", isAuth, getAllPosts);
router.post("/like/:id",isAuth,likeUnlikePost)
export default router;
