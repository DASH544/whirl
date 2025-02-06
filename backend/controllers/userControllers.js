import { UserModel } from "../models/userModel"

export const myProfile=async(req,res)=>
    {
        try {
            const user=await UserModel.findById()
        } catch (error) {
            
        }
    }