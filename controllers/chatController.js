const db = require("../db");
const moment = require("moment");
const admin = require("firebase-admin");

const { Chat, User, Message } = require("../models/chat");

const getChatRoom = async (req, res, next) => {
  try {
    const entities = [];
    const messages = [];

    const data = await db.collection("chats").doc(req.params.id).get();

    const message = await db
      .collection("chats")
      .doc(req.params.id)
      .collection("message")
      .get();

    message.forEach((doc) => {
      const messageText = new Message(
        doc.id,
        doc.data().sentAt,
        doc.data().sentBy,
        doc.data().userId,
        doc.data().readStatus,
        doc.data().messageText
      );

      messages.push(messageText);
    });

    entities.push({ chatRoomId: data.id, ...data.data(), message: messages });

    // data.forEach(async (doc) => {
    //   const chat = new Chat(
    //     doc.id,
    //     doc.data().user,
    //     doc.data().createdBy,
    //     doc.data().createdAt,
    //     doc.data().modifiedAt,
    //     doc.data().modifiedBy,
    //     doc.data().deletedAt,
    //     doc.data().deletedBy,
    //     doc.data().dataStatus
    //   );

    //   const messages = [];

    //   const message = await db
    //     .collection("chats")
    //     .doc(req.params.id)
    //     .collection("message")
    //     .get();

    //   message.forEach((doc) => {
    //     const messageText = new Message(
    //       doc.id,
    //       doc.data().sentAt,
    //       doc.data().sentBy,
    //       doc.data().userId,
    //       doc.data().readStatus,
    //       doc.data().messageText
    //     );

    //     messages.push(messageText);
    //   });
    // });

    res.status(200).send(entities);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addChatRoom = async (req, res, next) => {
  try {
    await db.collection("chats").add({
      user: [
        {
          userId: req.body.requesterUserId,
          lastMessageId: "",
        },
        {
          userId: req.body.providerUserId,
          lastMessageId: "",
        },
      ],
      createAt: moment().toISOString(),
      createdBy: req.body.requesterUserId,
      dataStatus: 0,
    });

    await db.collection("chats").doc(req.params.id).collection("message").add({
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
    const data = db.collection("chats");
    await data.doc(req.params.id).collection("message").add({
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      sentBy: req.body.userId,
      readStatus: 0,
      messageText: req.body.messageText,
    });

    res.status(200).send("add message successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateReadStatus = async (req, res, next) => {
  try {
    const data = db.collection("chats");

    const myUnreadMessage = await data
      .doc(req.params.id)
      .collection("message")
      .where("readStatus", "==", 0)
      .where("sentBy", "==", req.body.userId)
      .get();

    myUnreadMessage.forEach((doc) => {
      doc.ref.update({
        readStatus: 1,
      });
    });
    res.status(200).send("update read status successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateLastMessage = async (req, res, next) => {
  try {
    const data = db.collection("chats");

    await data
      .doc(req.params.id)
      .get()
      .then(async (doc) => {
        var data = doc.data();
        var user = data.user;

        const lastMessagePrev = await user.filter(
          ({ userId }) => userId === req.body.userId
        )[0].lastMessageId;

        await db
          .collection("chats")
          .doc(req.params.id)
          .update({
            user: admin.firestore.FieldValue.arrayRemove({
              userId: req.body.userId,
              lastMessageId: lastMessagePrev,
            }),
          });
        const lastMessage = await db
          .collection("chats")
          .doc(req.params.id)
          .collection("message")
          .orderBy("sentAt", "desc")
          .limit(1)
          .get();
        await db
          .collection("chats")
          .doc(req.params.id)
          .update({
            user: admin.firestore.FieldValue.arrayUnion({
              userId: req.body.userId,
              lastMessageId: lastMessage.docs[0].id,
            }),
          });
        res.status(200).send("update last message");
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });

    // await data
    //   .doc(req.params.id)
    //   .collection("message")
    //   .doc(req.params.messageId)
    //   .add({
    //     sentAt: moment().toISOString(),
    //     sentBy: req.body.userId,
    //     readStatus: 1,
    //     messageText: req.body.messageText,
    //   });

    // const lastMessage = await data
    //   .doc(req.params.id)
    //   .collection("message")
    //   .orderBy("sentAt", "desc")
    //   .limit(1)
    //   .get();

    // await data.doc(req.params.id).update({
    //   user: admin.firestore.FieldValue.arrayUnion({
    //     userId: req.body.userId,
    //     lastMessageId: lastMessage.docs[0].id,
    //   }),
    // });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deletedChatRoom = async (req, res, next) => {
  try {
    await db.collection(req.params.id).update({
      deletedAt: moment().toISOString(),
      deletedBy: req.params.userId,
      dataStatus: 1,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getChatRoom,
  addChatRoom,
  addMessage,
  updateLastMessage,
  deletedChatRoom,
  updateReadStatus,
};
