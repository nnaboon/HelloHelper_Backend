const express = require("express");
const {
  getUserChatRooms,
  getChatRoom,
  addChatRoom,
  addMessage,
  updateLastMessage,
  deletedChatRoom,
  updateReadStatus,
} = require("../controllers/chatController");

const router = express.Router();

router.get("/user/:userId", getUserChatRooms);
router.get("/:id", getChatRoom);

router.post("/", addChatRoom);
router.post("/:id/message", addMessage);

router.put("/last/:id", updateLastMessage);
router.put("/:id/read/status", updateReadStatus);
router.put("/delete/:id", deletedChatRoom);

module.exports = {
  routes: router,
};
