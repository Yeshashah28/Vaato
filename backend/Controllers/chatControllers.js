const asyncHandler=require("express-async-handler");
const Chat=require("../Models/ChatsModel.js");
const User = require("../Models/UserModel.js");
const Message=require("../Models/MessageModel.js");

const accessChat=asyncHandler(async(req,res)=>{
    const {userId}=req.body;
    if(!userId){
        console.log("userId not sent");
        return res.sendStatus(400);
    }

    var isChatExists=await Chat.find({
        isgroupchat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}},
        ]
    }).populate("users","-Password").populate("latestmessage");

    isChatExists=await User.populate(isChatExists,{
        path:"latestmessage.sender",
        select:"Username Email",
    })

    if(isChatExists.length>0){
        res.send(isChatExists[0]);
    } else {
        var chatData={
            chatname:"sender",
            isgroupchat:false,
            users:[req.user._id,userId]
        }
        try {
            const createChat=await Chat.create(chatData);
            const fullChat=await Chat.findOne({_id:createChat._id}).populate("users","-Password");
            res.status(200).json(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
            
        }
    }
});

const fetchChat=asyncHandler(async(req,res)=>{
    try {
        var existChats=await Chat.find({users:{$elemMatch:{$eq:req.user._id}}}).populate("users","-Password").populate("groupadmin","-password").populate({
  path: "latestmessage",
  populate: {
    path: "sender",
    select: "Username Email profilepic",
  },
});
    res.status(200).send(existChats);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
        
    }
  
});

const deleteChat=asyncHandler(async(req,res)=>{
    const chatId=req.params.chatId;
    await Chat.findByIdAndDelete(chatId);
    await Message.deleteMany({chat:chatId});
    res.status(200).json(`chat with id ${chatId} is deleted`);
});

const createGroupChat=asyncHandler(async(req,res)=>{
    if(!req.body.name && !req.body.users){
        return res.status(400).send({message: "Please Fill all the fields"});
    }
    var users = JSON.parse(req.body.users);
    if(users.length<2){
        return res.status(400).send({message:"a group cannot be created with less than 2 members"});
    }

    users.push(req.user);

    try {
        const groupChat=await Chat.create({
            chatname:req.body.name,
            isgroupchat:true,
            users:users,
            groupadmin:req.user,
        })
        const fullGroupChat=await Chat.findOne({_id:groupChat._id}).populate("users","-Password").populate("groupadmin","-Password");
            res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
        
    }
});

const renameGroup=asyncHandler(async(req,res)=>{
    const {chatId, chatName}=req.body;
    const updatedChat=await Chat.findByIdAndUpdate(
        chatId,{
            chatname: chatName,
        },{
            new:true,
        }
    ).populate("users","-Password").populate("groupadmin","-Password");
    if(!updatedChat){
        res.status(400);
        throw new Error("Chat not found");  
    } else{
        res.send(updatedChat)
    }
});

const removeUser=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body;
    const remove=await Chat.findByIdAndUpdate(
        chatId,
        {$pull:{users:userId}},
        {new:true}
    ).populate("users","-Password").populate("groupadmin","-Password");
     if(!remove){
        res.status(400);
        throw new Error("Chat not found");  
    } else{
        res.send(remove)
    }
});

const addUser=asyncHandler(async(req,res)=>{
    const {chatId,userId}=req.body;
    const add=await Chat.findByIdAndUpdate(
        chatId,
        {$push:{users:userId}},
        {new:true}
    ).populate("users","-Password").populate("groupadmin","-Password");
     if(!add){
        res.status(400);
        throw new Error("Chat not found");  
    } else{
        res.send(add)
    }
});

module.exports={accessChat,fetchChat,createGroupChat,renameGroup,removeUser,addUser,deleteChat}