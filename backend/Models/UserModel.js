const mongoose=require("mongoose");

const userschema=mongoose.Schema({
    Username:{type:String, required:true, unique:true},
    Email:{type:String,required:true},
    Password:{type:String,required:true},
    profilepic:{type:String, default:  function () {
        return `https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${this.Username}`;
      },}
},{ timestamps: true })

const User=mongoose.model("User",userschema);
module.exports=User;