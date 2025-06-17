const express=require("express");
const {registerUser, fetchUser}=require("../Controllers/userControllers.js");
const {loginUser}=require("../Controllers/userControllers.js");
const {allUsers}=require("../Controllers/userControllers.js");
const {protect}=require("../Middleware/userMiddleware.js")

const router=express.Router();

router.route("/").post(registerUser);
router.route("/login").post(loginUser);
router.route("/").get(protect,allUsers);

module.exports=router;