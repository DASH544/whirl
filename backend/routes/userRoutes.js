import express, { Router } from "express";
import { isAuth } from "./../middlewares/isAuth.js";
import { followandUnfollowUser, myProfile, updatePassword, updateProfile, userFollowerandFollowingData, userProfile } from "../controllers/userControllers.js";
import uploadFile from "../middlewares/multer.js";
const router = express.Router();

router.get("/me", isAuth, myProfile);
router.get("/:id",isAuth,userProfile)
router.post("/follow/:id",isAuth,followandUnfollowUser)
router.get("/followdata/:id",isAuth,userFollowerandFollowingData)
router.put('/:id',isAuth,uploadFile,updateProfile)
router.post("/:id",isAuth,updatePassword)
export default router;
