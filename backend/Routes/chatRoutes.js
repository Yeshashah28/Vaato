const express=require("express")
const {accessChat,fetchChat,createGroupChat,renameGroup,removeUser,addUser, deleteChat}=require("../Controllers/chatControllers.js")
const {protect}=require("../Middleware/userMiddleware.js")

const router=express.Router();
router.route("/").post(protect,accessChat);
router.route("/").get(protect,fetchChat);
router.route("/group").post(protect,createGroupChat);
router.route("/rename").post(protect,renameGroup);
router.route("/groupRemove").post(protect,removeUser);
router.route("/groupAdd").post(protect,addUser);
router.route("/deleteChat/:chatId").delete(protect,deleteChat);

module.exports=router;