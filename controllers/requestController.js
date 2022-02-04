const db = require("../db");
const moment = require("moment");
const {
  Request,
  ProvidedUserId,
  RequesterUserId,
} = require("../models/request");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

const storage = admin.storage();
const bucket = storage.bucket();

const getRequests = async (req, res, next) => {
  try {
    const entities = [];

    const data = await db
      .collection("requests")
      .where("dataStatus", "==", 0)
      .get();

    if (data.empty) {
      res.status(404).send("No request found");
    } else {
      await Promise.all(
        data.docs.map(async (doc) => {
          const user = await db
            .collection("users")
            .doc(doc.data().userId)
            .get();
          const id = doc.id;
          const request = new Request(
            id,
            doc.data().title,
            doc.data().location,
            doc.data().imageUrl,
            doc.data().description,
            doc.data().price,
            doc.data().serviceCharge,
            doc.data().number,
            doc.data().payment,
            doc.data().userId,
            doc.data().communityId,
            doc.data().category,
            doc.data().hashtag,
            doc.data().provideSum,
            doc.data().visibility
          );

          const requesterUserEntities = [];
          const providedUserEntities = [];

          const requesterUserId = await db
            .collection("requests")
            .doc(id)
            .collection("requesterUserId")
            .get();

          requesterUserId.forEach((doc) => {
            const requesterUser = new RequesterUserId(
              doc.data().userId,
              doc.data().createAt,
              doc.data().createdBy,
              doc.data().modifiedAt,
              doc.data().modifiedBy,
              doc.data().deletedAt,
              doc.data().deletedBy,
              doc.data().dataStatus
            );
            requesterUserEntities.push(requesterUser);
          });

          Object.assign(request, {
            requesterUserId: requesterUserEntities,
          });

          const providedUserId = await db
            .collection("requests")
            .doc(id)
            .collection("providedUserId")
            .get();

          providedUserId.forEach((doc) => {
            const providedUser = new ProvidedUserId(
              doc.data().userId,
              doc.data().status,
              doc.data().createAt,
              doc.data().createdBy,
              doc.data().modifiedAt,
              doc.data().modifiedBy,
              doc.data().deletedAt,
              doc.data().deletedBy,
              doc.data().dataStatus
            );
            providedUserEntities.push(providedUser);
          });
          Object.assign(request, {
            providedUserId: providedUserEntities,
            user: {
              imageUrl: user.data().imageUrl,
              recommend: user.data().recommend,
              rank: user.data().rank,
              username: user.data().username,
              email: user.data().email,
              rating: user.data().rating,
            },
          });
          entities.push(request);
        })
      );
      res.status(200).send(entities);
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getRequest = async (req, res, next) => {
  try {
    const data = await db.collection("requests").doc(req.params.id).get();
    const id = data.id;
    const entities = [];
    const requesterUserEntities = [];
    const providedUserEntities = [];
    const requesterUserId = await db
      .collection("requests")
      .doc(id)
      .collection("requesterUserId")
      .get();
    const providedUserId = await db
      .collection("requests")
      .doc(id)
      .collection("providedUserId")
      .get();

    if (data.empty || data.data().dataStatus == 1) {
      res.status(404).send("Data not found");
    } else {
      entities.push({ requestId: id, ...data.data() });
      await Promise.all(
        requesterUserId.docs.map(async (doc) => {
          const user = await db
            .collection("users")
            .doc(doc.data().userId)
            .get();
          const requesterUser = new RequesterUserId(
            doc.data().userId,
            doc.data().createAt,
            doc.data().createdBy,
            doc.data().modifiedAt,
            doc.data().modifiedBy,
            doc.data().deletedAt,
            doc.data().deletedBy,
            doc.data().dataStatus
          );
          requesterUserEntities.push({
            ...requesterUser,
            username: user.data().username,
            imageUrl: user.data().imageUrl,
            recommend: user.data().recommend,
          });
        })
      );
      Object.assign(...entities, {
        requesterUserId: requesterUserEntities,
      });

      providedUserId.forEach((doc) => {
        const providedUser = new ProvidedUserId(
          doc.data().userId,
          doc.data().status,
          doc.data().createAt,
          doc.data().createdBy,
          doc.data().modifiedAt,
          doc.data().modifiedBy,
          doc.data().deletedAt,
          doc.data().deletedBy,
          doc.data().dataStatus
        );
        providedUserEntities.push(providedUser);
      });
      Object.assign(...entities, {
        providedUserId: providedUserEntities,
      });
      res.status(200).send(...entities);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getMyRequest = async (req, res, next) => {
  try {
    const entities = [];

    const data = await db
      .collection("requests")
      .where("userId", "==", req.params.id)
      .where("dataStatus", "==", 0)
      .get();

    if (data.empty) {
      res.status(200).send(entities);
    } else {
      await Promise.all(
        data.docs.map(async (doc) => {
          const id = doc.id;
          if (!doc.data.communityId) {
            const request = new Request(
              id,
              doc.data().title,
              doc.data().location,
              doc.data().imageUrl,
              doc.data().description,
              doc.data().price,
              doc.data().serviceCharge,
              doc.data().number,
              doc.data().payment,
              doc.data().userId,
              doc.data().communityId,
              doc.data().category,
              doc.data().hashtag,
              doc.data().provideSum,
              doc.data().visibility
            );

            const requesterUserEntities = [];
            const providedUserEntities = [];

            const requesterUserId = await db
              .collection("requests")
              .doc(id)
              .collection("requesterUserId")
              .get();

            requesterUserId.forEach((doc) => {
              const requesterUser = new RequesterUserId(
                doc.data().userId,
                doc.data().createAt,
                doc.data().createdBy,
                doc.data().modifiedAt,
                doc.data().modifiedBy,
                doc.data().deletedAt,
                doc.data().deletedBy,
                doc.data().dataStatus
              );
              requesterUserEntities.push(requesterUser);
            });

            Object.assign(request, {
              requesterUserId: requesterUserEntities,
            });

            const providedUserId = await db
              .collection("requests")
              .doc(id)
              .collection("providedUserId")
              .get();

            providedUserId.forEach((doc) => {
              const providedUser = new ProvidedUserId(
                doc.data().userId,
                doc.data().status,
                doc.data().createAt,
                doc.data().createdBy,
                doc.data().modifiedAt,
                doc.data().modifiedBy,
                doc.data().deletedAt,
                doc.data().deletedBy,
                doc.data().dataStatus
              );
              providedUserEntities.push(providedUser);
            });
            Object.assign(request, {
              providedUserId: providedUserEntities,
            });
            entities.push(request);
          }
        })
      );
      res.status(200).send(entities);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addRequest = async (req, res, next) => {
  try {
    db.collection("requests").add({
      ...req.body,
      createAt: moment().toISOString(),
      createdBy: req.body.userId,
      modifiedAt: moment().toISOString(),
      modifiedBy: req.body.userId,
      dataStatus: 0,
    });

    const user = await db
      .collection("users")
      .where("category", "array-contains", ...req.body.category)
      .get();

    user.forEach((doc) => {
      if (doc.data().userId !== req.body.userId) {
        let authData = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "srisawasdina@gmail.com",
            pass: "na21122542",
          },
        });
        authData.sendMail({
          from: "Hello Helper<accounts@franciscoinoque.tech>",
          to: doc.data().email,
          subject: "มีคนต้องการความช่วยเหลือ",
          html: `สวัสดี<br /><br />เราพบว่ามีผู้ต้องการความช่วยเหลือตรงกับสิ่งที่คุณสามารถช่วยเหลือได้<br /><br />ลองเช็คดูที่ได้ <a href="#">ที่นี่</a>`,
        });
      }
    });
    res.status(200).send("request created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addRequesterUserId = async (req, res, next) => {
  try {
    const isExistData = await db
      .collection("requests")
      .doc(req.params.id)
      .collection("requesterUserId")
      .where("userId", "==", req.body.userId)
      .get();

    if (isExistData.size > 0) {
      res.status(400).send("you already send request");
    } else {
      const request = await db.collection("requests").doc(req.params.id).get();
      const data = await db
        .collection("requests")
        .doc(req.params.id)
        .collection("requesterUserId")
        .add({
          userId: req.body.userId,
          createAt: moment().toISOString(),
          createdBy: req.body.userId,
          dataStatus: 0,
        });

      const user = await db
        .collection("users")
        .doc(request.data().userId)
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
        subject: "มีคนต้องการให้ความช่วยเหลือ",
        html: `สวัสดี<br /><br />เราพบว่ามีผู้ต้องการให้ความช่วยเหลือตรงกับสิ่งที่คุณร้องขอ<br /><br />ลองเช็คดูที่ได้ <a href="#">ที่นี่</a>`,
      });
      res.status(200).send(data.id);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addProvidedUserId = async (req, res, next) => {
  try {
    const data = db
      .collection("requests")
      .doc(req.params.id)
      .collection("providedUserId")
      .get();

    if (data.exists) {
      res.status(400).send("already have provided");
    } else {
      await db
        .collection("requests")
        .doc(req.params.id)
        .collection("providedUserId")
        .add({
          userId: req.body.requesterUserId,
          status: "waiting",
          createAt: moment().toISOString(),
          createdBy: req.body.userId,
        });
      res.status(200).send("add provided successfully");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//ลิ้งค์กับตอน update order เพื่อนับยอด
const updateProvidedStatus = async (req, res, next) => {
  try {
    await db
      .collection("requests")
      .doc(req.params.requestId)
      .collection("providedUserId")
      .doc(req.params.providedId)
      .update({
        status: req.body.status,
        modifiedAt: moment().toISOString(),
        modifiedBy: req.body.userId,
      });

    res.status(200).send("update provided successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updatedRequest = async (req, res, next) => {
  try {
    const data = db.collection("requests").doc(req.params.id);
    await data.update(req.body);
    res.status(200).send("updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deletedRequest = async (req, res, next) => {
  try {
    const data = db.collection("requests").doc(req.params.id);
    await data.update({
      deletedAt: moment().toISOString(),
      deletedBy: req.body.userId,
      dataStatus: 1,
    });
    res.status(200).send("deleted successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const uploadImage = async (req, res, next) => {
  const folder = "requests";
  const fileName = `${folder}/${Date.now()}`;
  const fileUpload = bucket.file(fileName);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: "image/jpeg",
    },
  });

  blobStream.on("error", (err) => {
    res.status(405).json(err);
  });

  blobStream.on("finish", () => {
    // console.log(res);
    bucket
      .file(fileName)
      .getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      })
      .then((signedUrls) => {
        res.status(200).send(signedUrls[0]);
      });
  });

  blobStream.end(req.file.buffer);
};
const getImage = async (req, res, next) => {
  const file = bucket.file(`requests/${req.params.id}`);
  file.download().then((downloadResponse) => {
    res.status(200).send(downloadResponse[0]);
  });
};

module.exports = {
  getRequests,
  getRequest,
  getMyRequest,
  addRequest,
  addRequesterUserId,
  addProvidedUserId,
  updateProvidedStatus,
  updatedRequest,
  deletedRequest,
  uploadImage,
  getImage,
};
