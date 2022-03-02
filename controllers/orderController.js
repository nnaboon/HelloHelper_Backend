const db = require("../db");
const moment = require("moment");
const { Order } = require("../models/order");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

const getOrders = async (req, res, next) => {
  try {
    const data = await db.collection("orders").orderBy("title", "asc").get();
    const entities = [];

    if (data.empty) {
      res.status(404).send("No order found");
    } else {
      data.docs.map((doc) => {
        const order = new Order(
          doc.id,
          doc.data().chatId,
          doc.data().orderReferenceType,
          doc.data().orderReferenceId,
          doc.data().title,
          doc.data().location,
          doc.data().description,
          doc.data().number,
          doc.data().price,
          doc.data().serviceCharge,
          doc.data().rating,
          doc.data().receiver,
          doc.data().requesterUserId,
          doc.data().providerUserId,
          doc.data().payment,
          doc.data().status,
          new Date(doc.data().createdAt._seconds * 1000).toUTCString(),
          doc.data().createdBy,
          new Date(doc.data().modifiedAt._seconds * 1000).toUTCString(),
          doc.data().modifiedBy,
          doc.data().deletedAt,
          doc.data().deletedBy,
          doc.data().dataStatus
        );

        entities.push(order);
      });
      res.status(200).send(entities);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const data = await db.collection("orders").doc(req.params.id).get();
    const id = data.id;
    // const entities = [];

    if (data.empty) {
      res.status(404).send("No order found");
    } else {
      // entities.push({ id: id, ...data.data() });
      res.status(200).send({ id: id, ...data.data() });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getWaitForConfirmOrders = async (req, res, next) => {
  try {
    const data = await db
      .collection("orders")
      .where("chatId", "==", req.params.id)
      .where("status", "==", "waiting")
      .get();
    const entities = [];

    if (data.size == 0) {
      res.status(200).send(entities);
    } else {
      data.docs.map((doc) => {
        const order = new Order(
          doc.id,
          doc.data().chatId,
          doc.data().orderReferenceType,
          doc.data().orderReferenceId,
          doc.data().title,
          doc.data().location,
          doc.data().description,
          doc.data().number,
          doc.data().price,
          doc.data().serviceCharge,
          doc.data().rating,
          doc.data().receiver,
          doc.data().requesterUserId,
          doc.data().providerUserId,
          doc.data().payment,
          doc.data().status,
          doc.data().createdAt
            ? new Date(doc.data().createdAt._seconds * 1000).toUTCString()
            : undefined,
          doc.data().createdBy,
          doc.data().modifiedAt
            ? new Date(doc.data().modifiedAt._seconds * 1000).toUTCString()
            : undefined,
          doc.data().modifiedBy,
          doc.data().deletedAt
            ? new Date(doc.data().deletedAt._seconds * 1000).toUTCString()
            : undefined,
          doc.data().deletedBy,
          doc.data().dataStatus
        );

        entities.push(order);
      });
      res.status(200).send(entities);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getMyRequestOrders = async (req, res, next) => {
  try {
    const data = await db
      .collection("orders")
      .where("requesterUserId", "==", req.params.userId)
      .get();

    const entities = [];

    if (data.empty) {
      res.status(200).send(entities);
    } else {
      data.docs.map((doc) => {
        if (doc.data().dataStatus == 0) {
          const order = new Order(
            doc.id,
            doc.data().chatId,
            doc.data().orderReferenceType,
            doc.data().orderReferenceId,
            doc.data().title,
            doc.data().location,
            doc.data().description,
            doc.data().number,
            doc.data().price,
            doc.data().serviceCharge,
            doc.data().rating,
            doc.data().receiver,
            doc.data().requesterUserId,
            doc.data().providerUserId,
            doc.data().payment,
            doc.data().status
          );
          entities.push(order);
        }
      });
      res.status(200).send(entities);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getMyProvideOrders = async (req, res, next) => {
  try {
    const data = await db
      .collection("orders")
      .where("providerUserId", "==", req.params.userId)
      .get();

    const entities = [];

    if (data.empty) {
      res.status(200).send(entities);
    } else {
      data.docs.map((doc) => {
        if (doc.data().dataStatus == 0) {
          const order = new Order(
            doc.id,
            doc.data().chatId,
            doc.data().orderReferenceType,
            doc.data().orderReferenceId,
            doc.data().title,
            doc.data().location,
            doc.data().description,
            doc.data().number,
            doc.data().price,
            doc.data().serviceCharge,
            doc.data().rating,
            doc.data().receiver,
            doc.data().requesterUserId,
            doc.data().providerUserId,
            doc.data().payment,
            doc.data().status
          );

          entities.push(order);
        }
      });
      res.status(200).send(entities);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addOrder = async (req, res, next) => {
  try {
    let idToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      console.log('Found "Authorization" header');
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split("Bearer ")[1];
    } else {
      console.log('Found "__session" cookie');
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    }

    admin
      .auth()
      .verifyIdToken(idToken)
      .then(async (decodedIdToken) => {
        await db
          .collection("orders")
          .add({
            ...req.body,
            status: "waiting",
            createdAt: admin.firestore.Timestamp.now(),
            createdBy: req.body.requesterUserId,
            dataStatus: 0,
          })
          .then((result) => {
            return result.get();
          })
          .then(async (result) => {
            const user = await db
              .collection("users")
              .doc(req.body.providerUserId)
              .get();

            let authData = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true,
              auth: {
                user: "srisawasdina@gmail.com",
                pass: "na21122542",
              },
            });

            await authData.sendMail({
              from: "Hello Helper<accounts@franciscoinoque.tech>",
              to: user.data().email,
              subject: "เราพบว่าคุณมีออเดอร์รอการยืนยัน",
              html: `สวัสดี<br /><br />เราพบว่าคุณมีออเดอร์รอการยืนยัน <br /><br />สามารถเช็คดูที่ได้ <a href="#">ที่นี่</a>`,
            });

            res.status(200).send({
              id: result.id,
              ...result.data(),
            });
          });
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    return db
      .collection("orders")
      .doc(req.params.id)
      .update({
        status: req.body.status,
        modifiedAt: admin.firestore.Timestamp.now(),
        modifiedBy: req.body.providerUserId,
        dataStatus: 0,
      })
      .then(() => {
        return db.collection("orders").doc(req.params.id).get();
      })
      .then(async (result) => {
        if (result.data().orderReferenceType === "request") {
          const provide = await db
            .collection("requests")
            .doc(req.params.id)
            .collection("providedUserId")
            .get();

          provide.forEach(async (doc) => {
            await db
              .collection("requests")
              .doc(req.params.id)
              .collection("providedUserId")
              .doc(doc.id)
              .update({ status: req.body.status });
          });
          res.status(200).send("updated order successfully");
        } else {
          res.status(200).send("updated order successfully");
        }
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const disableOrder = async (req, res, next) => {
  try {
    await db.collection("orders").doc(req.params.id).update({
      deletedAt: admin.firestore.Timestamp.now(),
      deletedBy: req.body.userId,
      dataStatus: 1,
    });
    res.status(200).send("updated order successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteConfirmOrder = async (req, res, next) => {
  try {
    await db.collection("orders").doc(req.params.id).delete();
    res.status(200).send("updated order successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateProvideSum = async (req, res, next) => {
  try {
    const data = await db.collection("orders").doc(req.params.id).update({
      rating: req.body.rating,
      modifiedAt: admin.firestore.Timestamp.now(),
      modifiedBy: req.body.requesterUserId,
    });

    // const provideSumUserPrev = await db
    //   .collection("users")
    //   .doc(req.body.providerUserId)
    //   .get();

    // const provideSumOrderPrev = await db
    //   .collection("provides")
    //   .doc(req.body.orderReferenceId)
    //   .get();

    // const requestSumPrev = await db
    //   .collection("users")
    //   .doc(req.body.requesterUserId)
    //   .get();

    // update provider side
    await db
      .collection("provides")
      .doc(req.body.orderReferenceId)
      .update({
        // provideSum: provideSumOrderPrev.data().provideSum + 1,
        provideSum: admin.firestore.FieldValue.increment(1),
      })
      .then(async (res) => {
        const data = await db
          .collection("provides")
          .doc(req.body.orderReferenceId)
          .get();
        await db
          .collection("provides")
          .doc(req.body.orderReferenceId)
          .update({
            rating:
              data.data().rating +
              (req.body.rating - data.data().rating) / data.data().provideSum,
          });
      });

    await db
      .collection("users")
      .doc(req.body.providerUserId)
      .update({
        // provideSum: provideSumUserPrev.data().provideSum + 1,
        provideSum: admin.firestore.FieldValue.increment(1),
      })
      .then(async (res) => {
        const data = await db
          .collection("users")
          .doc(req.body.providerUserId)
          .get();

        await db
          .collection("users")
          .doc(req.body.providerUserId)
          .update({
            rating:
              data.data().rating +
              (req.body.rating - data.data().rating) / data.data().provideSum,
          });

        if (data.data().rank >= 3 && data.data().rating >= 4) {
          await db.collection("users").doc(req.body.providerUserId).update({
            recommend: 1,
          });
        }

        if (data.data().rating >= 4) {
          switch (true) {
            case data.data().provideSum > 0 && data.data().provideSum < 50:
              await db
                .collection("users")
                .doc(req.body.providerUserId)
                .update({ rank: "classic" });
              break;
            case data.data().provideSum >= 50 && data.data().provideSum < 100:
              await db
                .collection("users")
                .doc(req.body.providerUserId)
                .update({ rank: "silver" });
              break;
            case data.data().provideSum >= 100 && data.data().provideSum < 200:
              await db
                .collection("users")
                .doc(req.body.providerUserId)
                .update({ rank: "gold" });
              break;
            case data.data.provideSum >= 400 && data.data().rating >= 4.5:
              await db
                .collection("users")
                .doc(req.body.providerUserId)
                .update({ rank: "diamond" });
              break;
            case data.data.provideSum >= 500 && data.data().rating >= 4.5:
              await db
                .collection("users")
                .doc(req.body.providerUserId)
                .update({ rank: "platinum" });
              break;
          }
        }
      });

    // update requester side
    await db
      .collection("users")
      .doc(req.body.requesterUserId)
      .update({
        // requestSum: requestSumPrev.data().requestSum + 1,

        requestSum: admin.firestore.FieldValue.increment(1),
      });
    res.status(200).send("provideSum updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateRequestSum = async (req, res, next) => {
  try {
    const data = await db.collection("orders").doc(req.params.id).update({
      rating: req.body.rating,
      modifiedAt: admin.firestore.Timestamp.now(),
      modifiedBy: req.body.requesterUserId,
    });

    const requestSumPrev = await db
      .collection("users")
      .doc(req.body.requesterUserId)
      .get();

    await db
      .collection("users")
      .doc(req.body.requesterUserId)
      .update({
        // requestSum: requestSumPrev.data().requestSum + 1,
        requestSum: admin.firestore.FieldValue.increment(1),
      });

    await db
      .collection("users")
      .doc(req.body.providerUserId)
      .update({
        // provideSum: requestSumPrev.data().provideSum + 1,

        provideSum: admin.firestore.FieldValue.increment(1),
      })
      .then(async (res) => {
        const data = await db
          .collection("users")
          .doc(req.body.providerUserId)
          .get();

        await db
          .collection("users")
          .doc(req.body.providerUserId)
          .update({
            rating:
              data.data().rating +
              (req.body.rating - data.data().rating) / data.data().provideSum,
          });

        if (data.data().rank >= 3 && data.data().rating >= 4) {
          await db.collection("users").doc(req.body.providerUserId).update({
            recommend: 1,
          });
        }

        if (data.data().rating >= 4) {
          switch (true) {
            case data.data().provideSum > 0 && data.data().provideSum < 50:
              await db
                .collection("users")
                .doc(req.body.providerUserId)
                .update({ rank: "classic" });
              break;
            case data.data().provideSum >= 50 && data.data().provideSum < 100:
              await db
                .collection("users")
                .doc(req.body.providerUserId)
                .update({ rank: "silver" });
              break;
            case data.data().provideSum >= 100 && data.data().provideSum < 200:
              await db
                .collection("users")
                .doc(req.body.providerUserId)
                .update({ rank: "gold" });
              break;
            case data.data.provideSum >= 400 && data.data().rating >= 4.5:
              await db
                .collection("users")
                .doc(req.body.providerUserId)
                .update({ rank: "diamond" });
              break;

            case data.data.provideSum >= 500 && data.data().rating >= 4.5:
              await db
                .collection("users")
                .doc(req.body.providerUserId)
                .update({ rank: "platinum" });
              break;
          }
        }
      });
    res.status(200).send("requestSum updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getOrders,
  getOrder,
  getWaitForConfirmOrders,
  getMyRequestOrders,
  getMyProvideOrders,
  addOrder,
  updateOrderStatus,
  disableOrder,
  deleteConfirmOrder,
  updateRequestSum,
  updateProvideSum,
};
