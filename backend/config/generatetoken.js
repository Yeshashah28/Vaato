const jwt=require("jsonwebtoken");

const generatetoken=(id)=>{
  return jwt.sign({id},process.env.secret_key,{expiresIn:"30d"});
}

module.exports=generatetoken;