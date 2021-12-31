const express = require("express");
const {
  getChatRoom,
  addChatRoom,
  addMessage,
  updateLastMessage,
  deletedChatRoom,
  updateReadStatus,
} = require("../controllers/chatController");

const router = express.Router();

router.get("/:id", getChatRoom);

router.post("/", addChatRoom);
router.post("/message/:id", addMessage);

router.put("/last/:id", updateLastMessage);
router.put("/read/:id", updateReadStatus);
router.put("/delete/:id", deletedChatRoom);

module.exports = {
  routes: router,
};
