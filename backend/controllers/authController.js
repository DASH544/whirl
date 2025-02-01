import { z } from "zod";
import { User } from "../models/userModel.js";
import getDataUrl from "../utils/urlGenerator.js";
import bcrypt from "bcrypt"
const requiredBody = z.object({
  name: z.string().min(3).max(32),
  email: z.string().email(),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,),
gender:z.string()
});
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    const file=req.file;
    if(!file)
        {
            res.status(400).json(
                {
                    message:"File not uploaded"
                })
        }
    const parsedBody=requiredBody.safeParse(req.body)
    if(!parsedBody.success)
        {
            res.status(400).json(
                {
                    message:parsedBody.error
                })
        }
    else
    {
        let user=await User.findOne({email})
        if(!user) return 
        res.json({messge:"User Already Exits"})
        
         const fileUrl=getDataUrl(file)

         const hashPassword=await bcrypt.hash(password,10)
         
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
