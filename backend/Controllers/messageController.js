const asyncHandler=require("express-async-handler");
const User=require("../Models/UserModel");
const Chat=require("../Models/ChatsModel");
const Message=require("../Models/MessageModel");

const saveMessages=asyncHandler(async(req,res)=>{

    const {sender,content,chat}=req.body;
    if(!sender || !content || !chat){
        return res.status(400).json({error:"missing fields"});
    }

    const newmessage=await Message.create({
        sender:sender,
        content:content,
        chat:chat,
    })
    const savedmessage=await Message.findById(newmessage._id).populate("sender", "Username profilepic").populate("chat");
    await savedmessage.populate({
    path: "chat.users",
    select: "Username Email profilepic",
  });
  await Chat.findByIdAndUpdate(savedmessage.chat._id, { latestmessage: savedmessage._id });
    res.status(200).json(savedmessage)
})

const retrieveMessages=asyncHandler(async(req,res)=>{
    const findchat=await Message.find({chat: req.params.chatId}).populate("sender","Username profilepic").sort("createdAt");
    res.status(200).json(findchat);
})

module.exports={saveMessages,retrieveMessages};

