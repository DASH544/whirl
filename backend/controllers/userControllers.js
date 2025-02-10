import { UserModel } from "../models/userModel.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";
import {z} from "zod"
export const myProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
export const userProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "No user with this Id" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const followandUnfollowUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    const loggedInuser = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json("No user with this id");

    if (user._id.toString() === loggedInuser._id.toString())
      return res.status(400).json({ message: "User cannot follow itself" });

    //UNFOLLOW CASE
    if (user.followers.includes(loggedInuser._id)) {
      const indexFollowing = loggedInuser.followings.indexOf(user._id);
      const indexFollower = user.followers.indexOf(loggedInuser._id);

      loggedInuser.followings.splice(indexFollowing, 1);
      user.followers.splice(indexFollower, 1);

      await loggedInuser.save();
      await user.save();

      res.status(200).json({ message: "User Unfollowed" });
    }
    //FOLLOW CASE
    else {
      loggedInuser.followings.push(user._id);
      user.followers.push(loggedInuser._id);
      await loggedInuser.save();
      await user.save();
      res.status(200).json({ message: "User Followed" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const userFollowerandFollowingData = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
       .select("-password")
       .populate("followers","-password").populate("followings","-password");
   const followers=user.followers
   const followings=user.followings
   res.status(200).json({followers,followings})
  } catch (error) {
    res.status(500).json(error.message);
  }
};
export const updateProfile=async (req,res)=>
  {
    try {
      const user=await UserModel.findById(req.user.id)
      const {name}=req.body
      if(name){user.name=name}
      const file=req.file
      if(file)
        {
          const fileUrl=getDataUrl(file)

          await cloudinary.v2.uploader.destroy(user.profilePic.id)
          const myCloud=await cloudinary.v2.uploader.upload(fileUrl.content)

          user.profilePic.id=myCloud.public_id;
          user.profilePic.url=myCloud.secure_url;
        }

        await user.save()
        res.status(200).json({message:"Profile Updated"})

    } catch (error) {
      res.status(500).json(error.message)
    }

  }
//add zod validation
export const updatePassword=async(req,res)=>
  {
    try {
      const user=await UserModel.findById(req.user.id)
      if(!user) return res.status(404).json({message:"User Not Found"})
      const {oldPass,newPass}=req.body

      const comparePass=await bcrypt.compare(oldPass,user.password)
    if(!comparePass) return res.status(400).json({message:"Invalid Credentails"})
      const pass=await bcrypt.hash(newPass,10)
    user.password=pass
    await user.save()
    res.status(200).json({message:"Password Updated Successfully"})

    } catch (error) {
      res.status(500).json(error.message)
    }
  }