import { PostModel } from "../models/postModel.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";

export const newPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const ownerId = req.user._id;
    const file = req.file;
    const fileUrl = getDataUrl(file);
    let option;
    const type = req.query.type;
    if (type === "reel") {
      option = {
        resource_type: "video",
      };
    } else {
      option = {};
    }
    const myCloud = await cloudinary.v2.uploader.upload(
      fileUrl.content,
      option
    );
    const post = await PostModel.create({
      caption: caption,
      post: {
        id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      owner: ownerId,
      type: type,
    });
    res.status(201).json({ message: "Post Created Succesfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
export const deletePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not Found" });
    if (post.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });
    await cloudinary.v2.uploader.destroy(post.post.id);
    await post.deleteOne();
    res.status(200).json({ message: "Post Deleted Succesfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
export const getAllPosts = async (req, res) => {
    try {
  const posts = await PostModel.find({ type: "post" })
    .sort({ createdAt: -1 })
    .populate("owner","-password");
    const reels = await PostModel.find({ type: "reel" })
    .sort({ createdAt: -1 })
    .populate("owner","-password");
    res.status(200).json({posts,reels})
} catch (error) {
        res.status(500).json(error.message)
}
};
export const likeUnlikePost=async (req,res)=>
  {
    try {
      const post=await PostModel.findById(req.params.id)
      if(!post) return res.status(404).json({message:"No Post Found"})
      if(post.likes.includes(req.user._id))
        {
          const index=post.likes.indexOf(req.user._id)
          post.likes.splice(index,1)
          await post.save()
          res.status(201).json({message:"Post Unliked"})
        }
        else
        {
          post.likes.push(req.user._id)
          await post.save()
          res.status(201).json({message:"Post Liked"})
        }

    } catch (error) {
      res.status(500).json(error.message)
    }
  }
