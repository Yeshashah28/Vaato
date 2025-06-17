const mongoose=require("mongoose");

const Chatschema=mongoose.Schema({
chatname:{type:String, required:true, trim:true},
isgroupchat:{type:Boolean, default:false},
users:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
latestmessage:{type:mongoose.Schema.Types.ObjectId, ref:"Message"},
groupadmin:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
},{ timestamps: true })

const Chat=mongoose.model("Chat",Chatschema);
module.exports=Chat;

