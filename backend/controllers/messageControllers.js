import { chatModel } from "../models/chatModel.js";
import { MessageModel } from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { reciverId, message } = req.body;

    const senderId = req.user._id;
    if(!reciverId) return res.status(400).json({message:"no recivers id"})
    let chat = await chatModel.findOne({
      users: { $all: [senderId, reciverId] },
    });
    if (!chat) {
      chat = new chatModel({
        users: [senderId, reciverId],
        latestMessage: {
          text: message,
          sender: senderId,
        },
      });

      await chat.save();
    }
    const newMessage = new MessageModel({
      chatId: chat._id,
      sender: senderId,
      text: message,
    });
    await newMessage.save();

    await chat.updateOne({
      latestMessage: {
        text: message,
        sender: senderId,
      },
    });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
export const getAllMessages=async(req,res)=>
    {
        try {
            const {id}=req.params
            const userId=req.user._id

            const chat=await chatModel.findOne(
                {
                    users:{$all:[userId,id]}
                })
            if(!chat) return res.status(404).json({message:"No chat with these users"})
                const messages=await MessageModel.find(
            {
                chatId:chat._id
            });
            res.status(200).json(messages)
            } catch (error) {
            res.status(500).json(error.message)
        }
    }
export const getAllChats=async (req,res)=>
    {
        const chats=await chatModel.find(
            {
                users:req.user._id
            }).populate({
                path:"users",
                select:"name profilePic"
            })
            chats.forEach((item)=>
                {
                    item.users=item.users.filter(user=>user._id.toString()!==req.user._id.toString())
                })

        res.json(chats)
    }