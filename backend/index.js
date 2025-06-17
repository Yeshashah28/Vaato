const express=require("express");
const userRoutes=require("./Routes/userRoutes.js");
const chatRoutes=require("./Routes/chatRoutes.js");
const messageRoutes=require("./Routes/messageRoutes.js");
const path=require("path");
const socketIO=require("socket.io");
const http=require("http");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const db=require("./config/db.js");
const { connection } = require("mongoose");
const Message = require("./Models/MessageModel.js");

const app=express();
const server=http.createServer(app);

db();

app.use(express.json());

app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);

const io=socketIO(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000",
        credentials:true
    }
})

io.on("connection",(socket)=>{
    console.log("socket connected",socket.id);

    socket.on("join chat",(chatId)=>{
        socket.join(chatId);
        console.log("User joined chat",chatId);
    });

    socket.on("new message", async(newmessage)=>{
        const chatId=newmessage.chat._id;
        if(!chatId) return ;

        const findmessage=await Message.findById(newmessage._id).populate("sender", "Username profilepic").populate("chat");

        io.in(chatId).emit("message received", findmessage);
    });

    socket.on("disconnect",()=>{
        console.log("client disconnected",socket.id);
    })
})
const PORT=process.env.PORT||5000;
server.listen(PORT,()=>{
    console.log("server is working");
})