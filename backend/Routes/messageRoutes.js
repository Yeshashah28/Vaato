const express=require("express");
const {saveMessages, retrieveMessages, deleteMessages}=require("../Controllers/messageController");
const {protect}=require("../Middleware/userMiddleware");

const router=express.Router();

router.route("/").post(protect,saveMessages);
router.route("/:chatId").get(protect,retrieveMessages);

module.exports=router;
