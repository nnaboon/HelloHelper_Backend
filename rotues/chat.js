const express = require("express");
const { addChatRoom, addMessage } = require("../controllers/chatController");

const router = express.Router();

// router.get("/", getUsers);
// router.get("/:id", getUser);

router.post("/", addChatRoom);

router.put("/message/:id", addMessage);

// router.put("/:id", updateUserData);
// router.put("/delete/:id", deleteUser);

module.exports = {
  routes: router,
};
