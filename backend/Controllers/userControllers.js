const asyncHandler=require("express-async-handler")
const User=require("../Models/UserModel.js")
const generatetoken=require("../config/generatetoken.js")
const bcrypt=require("bcrypt")

const registerUser=asyncHandler(async(req,res)=>{
    const {Username,Email,Password}=req.body;
    if(!Username || !Email || !Password){
        throw new Error("enter all the details");
    }
    const usernameexists=await User.findOne({Username});
    const emailexists=await User.findOne({Email});

    if(usernameexists){
        throw new Error("User with this username already exists");
    }
    if(emailexists){
        throw new Error("User with this email already exists");
    }
    
        const salt=await bcrypt.genSalt(10);
        const hashpassword=await bcrypt.hash(Password, salt);
        const newuser=new User({Username,Email,Password:hashpassword});
        await newuser.save();

    if(newuser){
        res.status(201).json({
            _id:newuser._id,
            Username:newuser.Username,
            Email:newuser.Email,
            Password:newuser.Password,
            profilepic:newuser.profilepic,
            token:generatetoken(newuser._id),
        })
    }else{
        throw new Error("failed to create user");
        
    }
}
);

const loginUser=asyncHandler(async(req,res)=>{
    const {Email,Password}=req.body;
    if(!Email || !Password){
        throw new Error("enter all the details");
    }
    const userexists=await User.findOne({Email});

    if(userexists && await bcrypt.compare(Password,userexists.Password)){
        res.status(201).json({
            _id:userexists._id,
            Username:userexists.Username,
            Email:userexists.Email,
            Password:userexists.Password,
            profilepic:userexists.profilepic,
            token:generatetoken(userexists._id),
        })
    }else{
        throw new Error("User doesn't exist or wrong password");
        
    }
}
);

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});


module.exports={registerUser,loginUser,allUsers}
