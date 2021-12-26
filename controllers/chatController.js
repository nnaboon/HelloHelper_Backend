const db = require("../db");
const moment = require("moment");
const admin = require("firebase-admin");

const { Chat, User, Message } = require("../models/chat");

const addChatRoom = async (req, res, next) => {
  try {
    await db.collection("chats").add({
      user: [
        {
          userId: req.body.userId1,
        },
        {
          userId: req.body.userId2,
        },
      ],
      createAt: moment().toISOString(),
      createdBy: req.body.userId1, // userId1 = requester
      modifiedAt: moment().toISOString(),
      modifiedBy: req.body.userId1,
      deletedAt: req.body.deletedAt,
      deletedBy: req.body.deletedBy,
      dataStatus: 0,
    });

    await db.collection("chat").doc(req.params.id).collection("message").add({
      sentAt: moment().toISOString(),
      sentBy: req.body.userId1,
      readStatus: 0,
      messageText: req.body.messageText,
    });

    res.status(200).send("created chat room successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addMessage = async (req, res, next) => {
  try {
    res.status(200).send("add message successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addChatRoom,
  addMessage,
};
