const db = require("../db");
const { Provide, RequesterUserId } = require("../models/provide");
const moment = require("moment");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

const storage = admin.storage();
const bucket = storage.bucket();

const getProvides = async (req, res, next) => {
  try {
    const data = await db
      .collection("provides")
      .where("dataStatus", "==", 0)
      .get();

    const entities = [];

    if (data.empty) {
      res.status(404).send("No provide found");
    } else {
      await Promise.all(
        data.docs.map(async (doc) => {
          const id = doc.id;
          const user = await db
            .collection("users")
            .doc(doc.data().userId)
            .get();
          if (!doc.data.communityId) {
            const provide = new Provide(
              id,
              doc.data().title,
              doc.data().location,
              doc.data().imageUrl,
              doc.data().description,
              doc.data().rating,
              doc.data().provideSum,
              doc.data().serviceCharge,
              doc.data().payment,
              doc.data().userId,
              doc.data().communityId,
              doc.data().category,
              doc.data().hashtag,
              doc.data().visibility
            );

            const requesterUserEntities = [];
            const requesterUserId = await db
              .collection("provides")
              .doc(id)
              .collection("requesterUserId")
              .get();

            requesterUserId.forEach(async (doc) => {
              const requesterUser = new RequesterUserId(
                doc.data().userId,
                doc.data().status,
                doc.data().createdAt,
                doc.data().createdBy,
                doc.data().modifiedAt,
                doc.data().modifiedBy,
                doc.data().deletedAt,
                doc.data().deletedBy,
                doc.data().dataStatus
              );
              requesterUserEntities.push(requesterUser);
            });

            Object.assign(provide, {
              requesterUserId: requesterUserEntities,
              user: {
                imageUrl: user.data().imageUrl,
                recommend: user.data().recommend,
                rank: user.data().rank,
                username: user.data().username,
                email: user.data().email,
                rating: user.data().rating,
              },
            });

            entities.push(provide);
          }
        })
      );
      res.status(200).send(entities);
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getMyProvide = async (req, res, next) => {
  try {
    const data = await db
      .collection("provides")
      .where("userId", "==", req.params.id)
      .where("dataStatus", "==", 0)
      .get();

    const entities = [];

    if (data.empty) {
      res.status(200).send([]);
    } else {
      await Promise.all(
        data.docs.map(async (doc) => {
          const id = doc.id;
          const provide = new Provide(
            id,
            doc.data().title,
            doc.data().location,
            doc.data().imageUrl,
            doc.data().description,
            doc.data().rating,
            doc.data().provideSum,
            doc.data().serviceCharge,
            doc.data().payment,
            doc.data().userId,
            doc.data().communityId,
            doc.data().category,
            doc.data().hashtag,
            doc.data().visibility
          );

          const requesterUserEntities = [];
          const requesterUserId = await db
            .collection("provides")
            .doc(id)
            .collection("requesterUserId")
            .get();

          requesterUserId.forEach(async (doc) => {
            const requesterUser = new RequesterUserId(
              doc.data().userId,
              doc.data().status,
              doc.data().createdAt,
              doc.data().createdBy,
              doc.data().modifiedAt,
              doc.data().modifiedBy,
              doc.data().deletedAt,
              doc.data().deletedBy,
              doc.data().dataStatus
            );
            requesterUserEntities.push(requesterUser);
          });

          Object.assign(provide, {
            requesterUserId: requesterUserEntities,
          });

          entities.push(provide);
        })
      );
      res.status(200).send(entities);
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getProvide = async (req, res, next) => {
  try {
    const data = await db.collection("provides").doc(req.params.id).get();
    const user = await db.collection("users").doc(data.data().userId).get();

    const entities = [];
    const requesterUserEntities = [];

    if (data.empty || data.data().dataStatus == 1) {
      res.status(404).send("No user found");
    } else {
      const requesterUserId = await db
        .collection("provides")
        .doc(req.params.id)
        .collection("requesterUserId")
        .get();

      requesterUserId.forEach(async (doc) => {
        const requesterUser = new RequesterUserId(
          doc.data().userId,
          doc.data().status,
          doc.data().createdAt,
          doc.data().createdBy,
          doc.data().modifiedAt,
          doc.data().modifiedBy,
          doc.data().deletedAt,
          doc.data().deletedBy,
          doc.data().dataStatus
        );
        requesterUserEntities.push(requesterUser);
      });
      entities.push({ provideId: req.params.id, ...data.data() });

      Object.assign(...entities, {
        requesterUserId: requesterUserEntities,
        user: {
          imageUrl: user.data().imageUrl,
          recommend: user.data().recommend,
          rank: user.data().rank,
          username: user.data().username,
          email: user.data().email,
          rating: user.data().rating,
        },
      });
    }
    res.status(200).send(...entities);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addProvide = async (req, res, next) => {
  try {
    const data = await db.collection("provides").add({
      ...req.body,
      createAt: moment().toISOString(),
      createdBy: req.body.userId,
      modifiedAt: moment().toISOString(),
      modifiedBy: req.body.userId,
      dataStatus: 0,
    });
    res.status(200).send(data.id);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addRequesterUser = async (req, res, next) => {
  try {
    const data = db.collection("provides");
    await data
      .doc(req.params.id)
      .collection("requesterUserId")
      .add({
        ...req.body,
        createAt: moment().toISOString(),
        createdBy: req.body.userId,
        modifiedAt: moment().toISOString(),
        modifiedBy: req.body.userId,
        dataStatus: 0,
      });
    res.status(200).send("requester user added successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updatedProvide = async (req, res, next) => {
  try {
    const data = db.collection("provides").doc(req.params.id);
    await data.update({
      ...req.body,
      modifiedAt: moment().toISOString(),
      modifiedBy: req.body.userId,
    });
    res.status(200).send("updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deletedProvide = async (req, res, next) => {
  try {
    const data = db.collection("provides").doc(req.params.id);
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

// const uploadImage = async (req, res, next) => {
//   const multer = Multer({
//     storage: Multer.memoryStorage(),
//     limits: {
//       fileSize: 5 * 1024 * 1024,
//     },
//   }).single("img");

//   multer(req.img, res, function (err) {
//     if (err) {
//       console.log("Oh dear...");
//       console.log(err);
//       return;
//     } else {
//       const folder = "provides";
//       const fileName = `${folder}/${req.body.provideId}`;
//       const fileUpload = bucket.file(fileName);
//       const blobStream = fileUpload.createWriteStream({
//         metadata: {
//           contentType: req.type,
//         },
//       });

//       blobStream.on("error", (err) => {
//         res.status(405).json(err);
//       });
//     }
//   });

//   blobStream.on("finish", async () => {
//     await db
//       .collection("provides")
//       .doc(req.body.provideId)
//       .update({ imageUrl: fileName });
//     res.status(200).send("Upload complete!");
//   });

//   // blobStream.end(req.file.buffer);
// };

const uploadImage = async (req, res, next) => {
  const folder = "provides";
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
  const file = bucket.file(`provides/${req.params.id}`);
  file.download().then((downloadResponse) => {
    res.status(200).send(downloadResponse[0]);
  });
};

const updateProvideSum = async (req, res, next) => {
  try {
    const provideSumPrev = await db
      .collection("provides")
      .doc(req.params.id)
      .get();

    await db
      .collection("provides")
      .doc(req.params.id)
      .update({
        provideSum: provideSumPrev.data().provideSum + 1,
      });
    res.status(200).send("updated provide sum successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getProvides,
  getProvide,
  getMyProvide,
  addProvide,
  updatedProvide,
  deletedProvide,
  addRequesterUser,
  getImage,
  uploadImage,
  updateProvideSum,
};
