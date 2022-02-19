const db = require("../db");
const moment = require("moment");
const admin = require("firebase-admin");

const { Chat, User, Message } = require("../models/chat");

const getUserChatRooms = async (req, res, next) => {
  try {
    const entities = [];

    const data = await db
      .collection("chats")
      .where("users", "array-contains", req.params.userId)
      .orderBy("createdAt", "desc")
      .get();

    if (data.empty) {
      res.status(200).send(entities);
    } else {
      await Promise.all(
        data.docs.map(async (doc) => {
          const chat = new Chat(
            doc.id,
            doc.data().users,
            doc.data().lastMessage,
            new Date(doc.data().createdAt._seconds * 1000).toUTCString(),
            doc.data().createdBy,
            doc.data().dataStatus
          );

          const messages = [];
          const message = await db
            .collection("chats")
            .doc(doc.id)
            .collection("messages")
            .orderBy("createdAt")
            .get();

          if (message.size > 0) {
            message.forEach((doc) => {
              const messageText = new Message(
                doc.id,
                doc.data().readStatus,
                doc.data().messageText,
                new Date(doc.data().createdAt._seconds * 1000).toUTCString(),
                doc.data().createdBy
              );
              messages.push(messageText);
            });
            entities.push({ ...chat, messages: messages });
          } else {
            entities.push({ ...chat, messages: [] });
          }
        })
      );
      res.status(200).send(entities);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getChatRoom = async (req, res, next) => {
  try {
    const entities = [];
    const messages = [];

    const data = await db.collection("chats").doc(req.params.id).get();

    if (data.exist) {
      const message = await db
        .collection("chats")
        .doc(req.params.id)
        .collection("messages")
        .orderBy("createdAt")
        .get();

      message.forEach((doc) => {
        const messageText = new Message(
          doc.id,
          doc.data().readStatus,
          doc.data().messageText,
          new Date(doc.data().createdAt._seconds * 1000).toUTCString(),
          doc.data().createdBy
        );

        messages.push(messageText);
      });

      entities.push({ chatId: data.id, ...data.data(), messages: messages });
      res.status(200).send(entities);
    } else {
      res.status(200).send(entities);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addChatRoom = async (req, res, next) => {
  try {
    const isExistChatRoom = await db
      .collection("chats")
      .where("users", "array-contains-any", [
        req.body.requesterUserId,
        req.body.providerUserId,
      ])
      .get();

    if (isExistChatRoom.empty) {
      const newChatRoom = await db.collection("chats").add({
        lastMessage: [
          {
            userId: req.body.requesterUserId,
            lastMessage: undefined,
          },
          {
            userId: req.body.providerUserId,
            lastMessage: undefined,
          },
        ],
        users: [req.body.requesterUserId, req.body.providerUserId],
        createdAt: admin.firestore.Timestamp.now(),
        createdBy: req.body.requesterUserId,
        dataStatus: 0,
      });
      res.status(200).send(newChatRoom.id);
    } else {
      const data = isExistChatRoom.docs.filter(
        (doc) =>
          doc.data().users.includes(req.body.providerUserId) &&
          doc.data().users.includes(req.body.requesterUserId)
      );

      if (data.length > 0) {
        res.status(200).send(data[0].id);
      } else {
        const newChatRoom = await db.collection("chats").add({
          lastMessage: [
            {
              userId: req.body.requesterUserId,
            },
            {
              userId: req.body.providerUserId,
            },
          ],
          users: [req.body.requesterUserId, req.body.providerUserId],
          createdAt: admin.firestore.Timestamp.now(),
          createdBy: req.body.requesterUserId,
          dataStatus: 0,
        });
        res.status(200).send(newChatRoom.id);
      }
      // isExistChatRoom.docs.map(async (doc, index) => {
      //   console.log(
      //     doc.data().users.includes(req.body.providerUserId),
      //     doc.data().users.includes(req.body.requesterUserId)
      //   );
      //   if (
      //     doc.data().users.includes(req.body.providerUserId) &&
      //     doc.data().users.includes(req.body.requesterUserId)
      //   ) {
      //     res.status(200).send(doc.id);
      //     return;
      //   } else {
      //     if (isExistChatRoom.size === 1) {
      //       const newChatRoom = await db.collection("chats").add({
      //         lastMessage: [
      //           {
      //             userId: req.body.requesterUserId,
      //           },
      //           {
      //             userId: req.body.providerUserId,
      //           },
      //         ],
      //         users: [req.body.requesterUserId, req.body.providerUserId],
      //         createdAt: admin.firestore.Timestamp.now(),
      //         createdBy: req.body.requesterUserId,
      //         dataStatus: 0,
      //       });
      //       res.status(200).send(newChatRoom.id);
      //     } else if (index === isExistChatRoom.size - 1) {
      //       {
      //         console.log("2");
      //       }
      //       const newChatRoom = await db.collection("chats").add({
      //         lastMessage: [
      //           {
      //             userId: req.body.requesterUserId,
      //           },
      //           {
      //             userId: req.body.providerUserId,
      //           },
      //         ],
      //         users: [req.body.requesterUserId, req.body.providerUserId],
      //         createdAt: admin.firestore.Timestamp.now(),
      //         createdBy: req.body.requesterUserId,
      //         dataStatus: 0,
      //       });
      //       res.status(200).send(newChatRoom.id);
      //     }
      // }
      // });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const addMessage = async (req, res, next) => {
  try {
    const data = db
      .collection("chats")
      .doc(req.params.id)
      .collection("messages");

    const lastMessage = await db
      .collection("chats")
      .doc(req.params.id)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    return data
      .add({
        createdBy: req.body.senderUserId,
        createdAt: admin.firestore.Timestamp.now(),
        readStatus: [
          {
            userId: req.body.senderUserId,
            readAt: admin.firestore.Timestamp.now(),
            readStatus: 1,
          },
          {
            userId: req.body.receiverUserId,
            readStatus: 0,
          },
        ],
        messageText: req.body.messageText,
      })
      .then(async (result) => {
        await db
          .collection("chats")
          .doc(req.params.id)
          .update({
            lastMessage: admin.firestore.FieldValue.arrayRemove({
              userId: req.body.senderUserId,
              lastMessageId:
                lastMessage.size > 0 ? lastMessage?.docs[0].id : undefined,
            }),
          });

        await db
          .collection("chats")
          .doc(req.params.id)
          .update({
            lastMessage: admin.firestore.FieldValue.arrayUnion({
              userId: req.body.senderUserId,
              lastMessageId: result.id,
            }),
          });

        await db.collection("chats").doc(req.params.id).update({
          modifiedAt: admin.firestore.Timestamp.now(),
          modifiedBy: req.body.senderUserId,
        });

        return data.orderBy("createdAt").get();
      })
      .then(function (result) {
        const entities = [];

        result.docs.map((doc) => {
          const messageText = new Message(
            doc.id,
            doc.data().readStatus,
            doc.data().messageText,
            new Date(doc.data().createdAt._seconds * 1000).toUTCString(),
            doc.data().createdBy
          );
          entities.push(messageText);
        });
        res.status(200).send(entities);
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateReadStatus = async (req, res, next) => {
  try {
    const data = db.collection("chats");

    const myUnreadMessage = await data
      .doc(req.params.id)
      .collection("messages")
      .where("readStatus", "array-contains", {
        readStatus: 0,
        userId: req.body.senderUserId,
      })
      .get();

    if (myUnreadMessage.empty) {
      res.status(200).send("No unread messages");
    } else {
      await Promise.all(
        myUnreadMessage.docs.map(async (doc) => {
          await db
            .collection("chats")
            .doc(req.params.id)
            .collection("messages")
            .doc(doc.id)
            .update({
              readStatus: admin.firestore.FieldValue.arrayRemove({
                readStatus: 0,
                userId: req.body.senderUserId,
              }),
            });

          await db
            .collection("chats")
            .doc(req.params.id)
            .collection("messages")
            .doc(doc.id)
            .update({
              readStatus: admin.firestore.FieldValue.arrayUnion({
                readStatus: 1,
                readAt: admin.firestore.Timestamp.now(),
                userId: req.body.senderUserId,
              }),
            });
        })
      );
      res.status(200).send("update read status successfully");
    }
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
              lastMessageId: lastMessagePrev ?? undefined,
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

        await data.doc(req.params.id).update({
          modifiedAt: admin.firestore.Timestamp.now(),
          modifiedBy: req.body.userId,
        });
        res.status(200).send("update last message");
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deletedChatRoom = async (req, res, next) => {
  try {
    await db.collection(req.params.id).update({
      deletedAt: admin.firestore.Timestamp.now(),
      deletedBy: req.params.userId,
      dataStatus: 1,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getUserChatRooms,
  getChatRoom,
  addChatRoom,
  addMessage,
  updateLastMessage,
  deletedChatRoom,
  updateReadStatus,
};
