import mongoose from "mongoose";

const postSchema=new mongoose.Schema(
    {
        caption:
        {
            type:String,
            required:true
        },
        post:
        {
            id:String,
            url:String
        },
        type:
        {
            type:String,
            required:true
        },
        createdAt:
        {
            type:Date,
            default:Date.now,
        },
        likes:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }],
        comments:[
            {
                user:
                {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
                },
                name:
                {
                    type:String,
                    required:true
                },
                comment:
                {
                    type:String,
                    required:true
                }
            }],
            owner:
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
    })

export const PostModel=mongoose.model("Post",postSchema)