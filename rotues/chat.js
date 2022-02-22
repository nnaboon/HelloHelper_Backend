const express = require("express");
const Multer = require("multer");
const {
  getUserChatRooms,
  getChatRoom,
  addChatRoom,
  addMessage,
  updateLastMessage,
  deletedChatRoom,
  updateReadStatus,
  uploadImage,
} = require("../controllers/chatController");
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = express.Router();

router.get("/user/:userId", getUserChatRooms);
router.get("/:id", getChatRoom);

router.post("/", addChatRoom);
router.post("/:id/message", addMessage);
router.post("/upload", multer.single("img"), uploadImage);

router.put("/last/:id", updateLastMessage);
router.put("/:id/read/status", updateReadStatus);
router.put("/delete/:id", deletedChatRoom);

module.exports = {
  routes: router,
};
