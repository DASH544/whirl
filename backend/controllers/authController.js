import { z } from "zod";
import { UserModel } from "../models/userModel.js";
import getDataUrl from "../utils/urlGenerator.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import generateToken from "../utils/generateToken.js";
const requiredBody = z.object({
  name: z.string().min(3).max(32),
  email: z.string().email(),
  password: z.string(),
  gender: z.string(),
});
const registerBody=requiredBody.pick({name:true,email:true,password:true,gender:true})
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    const file = req.file;
    if (!file) {
      res.status(400).json({
        message: "File not uploaded",
      });
    }
    const parsedBody = registerBody.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({
        message: parsedBody.error,
      });
    } else {
      let user = await UserModel.findOne({ email });
      if (user) return res.json({ messge: "User Already Exits" });

      const fileUrl = getDataUrl(file);
      
      const hashPassword = await bcrypt.hash(password, 10);
      const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content);
      user = await UserModel.create({
        name: name,
        email: email,
        password: hashPassword,
        gender: gender,
        profilePic: {
          id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      });
      generateToken(user._id, res);
      res.status(201).json({ message: "User Registerd Successfully", user });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const loginBody=requiredBody.pick({email:true,password:true})
export const loginUser=async (req,res)=>
  {
    try {
      console.log("here")
      const { email , password }=req.body
       const parsedBody=loginBody.safeParse(req.body)
       if(!parsedBody.success) return res.status(400).json({message:parsedBody.error})
      const user=await UserModel.findOne({email})

    if(!user) return res.status(400).json({message:"Incorrect Credentials1"})
      const passwordMatch=await bcrypt.compare(password,user.password)
    if(!passwordMatch) return res.status(400).json({message:"Incorret Credentials2"})
      generateToken(user._id,res)
    res.json({message:"User Logged In",user})
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
export const logoutUser=(req,res)=>
  {
    res.cookie("token","",
      {
        maxAge:0
      })
    res.status(200).json({message:"User Logged Out Successfully"})
  }