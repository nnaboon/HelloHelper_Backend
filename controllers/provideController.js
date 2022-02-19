const db = require("../db");
const { Provide, RequesterUserId } = require("../models/provide");
const moment = require("moment");
const admin = require("firebase-admin");
const fs = require("fs");

const storage = admin.storage();
const bucket = storage.bucket();

let fields = {};
const BusBoy = require("busboy");
const path = require("path");
const os = require("os");

const getProvides = async (req, res, next) => {
  try {
    const data = await db
      .collection("provides")
      .where("visibility", "==", 1)
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
                doc.data().createdAt
                  ? new Date(doc.data().createdAt._seconds * 1000).toUTCString()
                  : undefined,
                doc.data().createdBy,
                doc.data().modifiedAt
                  ? new Date(
                      doc.data().modifiedAt._seconds * 1000
                    ).toUTCString()
                  : undefined,
                doc.data().modifiedBy,
                doc.data().deletedAt
                  ? new Date(doc.data().deletedAt._seconds * 1000).toUTCString()
                  : undefined,
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
      .where("userId", "==", req.params.userId)
      .where("dataStatus", "==", 0)
      .orderBy("createdAt")
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

          // const requesterUserEntities = [];
          // const requesterUserId = await db
          //   .collection("provides")
          //   .doc(id)
          //   .collection("requesterUserId")
          //   .get();

          // requesterUserId.forEach(async (doc) => {
          //   const requesterUser = new RequesterUserId(
          //     doc.data().userId,
          //     doc.data().status,
          //     doc.data().createdAt
          //       ? new Date(doc.data().createdAt._seconds * 1000).toUTCString()
          //       : undefined,
          //     doc.data().createdBy,
          //     doc.data().modifiedAt
          //       ? new Date(doc.data().modifiedAt._seconds * 1000).toUTCString()
          //       : undefined,
          //     doc.data().modifiedBy,
          //     doc.data().deletedAt
          //       ? new Date(doc.data().deletedAt._seconds * 1000).toUTCString()
          //       : undefined,
          //     doc.data().deletedBy,
          //     doc.data().dataStatus
          //   );
          //   requesterUserEntities.push(requesterUser);
          // });

          // Object.assign(provide, {
          //   requesterUserId: requesterUserEntities,
          // });

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
    const requesterUserId = await db
      .collection("provides")
      .doc(req.params.id)
      .collection("requesterUserId")
      .get();

    const entities = [];
    const requesterUserEntities = [];

    if (data.empty || data.data().dataStatus == 1) {
      res.status(404).send("No user found");
    } else {
      requesterUserId.forEach(async (doc) => {
        const requesterUser = new RequesterUserId(
          doc.data().userId,
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

const searchProvide = async (req, res, next) => {
  try {
    const data = await db
      .collection("provides")
      .where("visibility", "==", 1)
      .where("dataStatus", "==", 0)
      .where("category", "array-contains", req.params.category)
      .get();

    const entities = [];

    console.log(data.docs);
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

            entities.push({
              ...provide,
              user: {
                username: user.data().username,
                rank: user.data().rank,
                recommend: user.data().recommend,
                imageUrl: user.data().imageUrl,
              },
            });
          }
        })
      );
      res.status(200).send(entities);
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const addProvide = async (req, res, next) => {
  try {
    const data = await db.collection("provides").add({
      ...req.body,
      visibility: 1,
      createdAt: admin.firestore.Timestamp.now(),
      createdBy: req.body.userId,
      modifiedAt: admin.firestore.Timestamp.now(),
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
      .doc(req.params.provideId)
      .collection("requesterUserId")
      .add({
        ...req.body,
        createdAt: admin.firestore.Timestamp.now(),
        createdBy: req.params.userId,
        modifiedAt: admin.firestore.Timestamp.now(),
        modifiedBy: req.params.userId,
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
      modifiedAt: admin.firestore.Timestamp.now(),
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
      deletedAt: admin.firestore.Timestamp.now(),
      deletedBy: req.body.userId,
      dataStatus: 1,
    });
    res.status(200).send("deleted successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const uploadImage = async (req, res, next) => {
  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName = {};
  let imagesToUpload = [];
  let imageToAdd = {};
  let imageUrls = [];

  busboy.on("field", (fieldname, fieldvalue) => {
    fields[fieldname] = fieldvalue;
  });

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted!" });
    }

    // Getting extension of any image
    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    // Setting filename
    imageFileName = `${Math.round(
      Math.random() * 1000000000
    )}.${imageExtension}`;

    // Creating path
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToAdd = {
      imageFileName,
      filepath,
      mimetype,
    };

    file.pipe(fs.createWriteStream(filepath));
    //Add the image to the array
    imagesToUpload.push(imageToAdd);
  });

  busboy.on("finish", async () => {
    let promises = [];

    imagesToUpload.forEach((imageToBeUploaded) => {
      imageUrls.push(
        `https://firebasestorage.googleapis.com/v0/b/senior-project-97cfa.appspot.com/o/${imageToBeUploaded.imageFileName}?alt=media`
      );
      promises.push(
        admin
          .storage()
          .bucket()
          .upload(`${imageToBeUploaded.filepath}`, {
            destination: `provides/${imageFileName}`,
            resumable: false,
            metadata: {
              metadata: {
                contentType: imageToBeUploaded.mimetype,
              },
            },
          })
      );
    });

    try {
      await Promise.all(promises).then(() => {
        bucket
          .file(`provides/${imageFileName}`)
          .getSignedUrl({
            action: "read",
            expires: "03-09-2491",
          })
          .then((signedUrls) => {
            res.status(200).send(signedUrls[0]);
          });
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  busboy.end(req.rawBody);
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
  searchProvide,
  addProvide,
  updatedProvide,
  deletedProvide,
  addRequesterUser,
  getImage,
  uploadImage,
  updateProvideSum,
};
