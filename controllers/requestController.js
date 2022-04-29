const db = require("../db");
const moment = require("moment");
const {
  Request,
  ProvidedUserId,
  RequesterUserId,
} = require("../models/request");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const fs = require("fs");

const storage = admin.storage();
const bucket = storage.bucket();

let fields = {};
const BusBoy = require("busboy");
const path = require("path");
const os = require("os");

const getSuggestRequests = async (req, res, next) => {
  try {
    const entities = [];

    const data = await db
      .collection("requests")
      .where("dataStatus", "==", 0)
      .where("visibility", "==", 1)
      .limit(15)
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
            doc.data().visibility
          );

          const providedUserEntities = [];

          const providedUserId = await db
            .collection("requests")
            .doc(id)
            .collection("providedUserId")
            .get();

          providedUserId.forEach((doc) => {
            const providedUser = new ProvidedUserId(
              doc.id,
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
              doc.id,
              doc.data().userId,
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
              doc.id,
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
    await db
      .collection("requests")
      .doc(req.params.id)
      .update({
        visitor: admin.firestore.FieldValue.increment(1),
        modifiedAt: admin.firestore.Timestamp.now(),
        modifiedBy: req.body.userId,
      });

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
      res.status(404).send("No request found");
    } else {
      entities.push({ requestId: id, ...data.data() });
      await Promise.all(
        requesterUserId.docs.map(async (doc) => {
          const user = await db
            .collection("users")
            .doc(doc.data().userId)
            .get();
          const requesterUser = new RequesterUserId(
            doc.id,
            doc.data().userId,
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
          doc.id,
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

const getUserRequest = async (req, res, next) => {
  try {
    const entities = [];

    const data = await db
      .collection("requests")
      .where("userId", "==", req.params.userId)
      .where("dataStatus", "==", 0)
      .orderBy("createdAt")
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
                doc.id,
                doc.data().userId,
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
                doc.id,
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
        db.collection("requests")
          .add({
            ...req.body,
            visitor: 0,
            visibility: 1,
            createdAt: admin.firestore.Timestamp.now(),
            createdBy: req.body.userId,
            modifiedAt: admin.firestore.Timestamp.now(),
            modifiedBy: req.body.userId,
            dataStatus: 0,
          })
          .then(async (result) => {
            const user = await db
              .collection("users")
              .where("category", "array-contains", ...req.body.category)
              .get();

            user.forEach((doc) => {
              if (req.body.communityId) {
                if (
                  doc.data().communityId?.includes(req.body.communityId) &&
                  doc.data().userId !== req.body.userId
                ) {
                  let authData = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                      // user: testAccount.user,
                      // pass: testAccount.pass,
                    },
                  });
                  authData.sendMail({
                    from: "Hello Helper<accounts@franciscoinoque.tech>",
                    to: doc.data().email,
                    subject: "มีคนต้องการความช่วยเหลือ",
                    html: `สวัสดี<br /><br />เราพบว่ามีผู้ต้องการความช่วยเหลือตรงกับสิ่งที่คุณสามารถช่วยเหลือได้<br /><br />สามารถเช็คดูที่ได้ <a href="https://hello-helper-66225d.netlify.app/request/${req.body.title}/${result.id}">ที่นี่</a>`,
                  });
                }
              } else {
                if (doc.data().userId !== req.body.userId) {
                  let authData = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                      // user: testAccount.user,
                      // pass: testAccount.pass,
                    },
                  });
                  authData.sendMail({
                    from: "Hello Helper<accounts@franciscoinoque.tech>",
                    to: doc.data().email,
                    subject: "มีคนต้องการความช่วยเหลือ",
                    html: `สวัสดี<br /><br />เราพบว่ามีผู้ต้องการความช่วยเหลือตรงกับสิ่งที่คุณสามารถช่วยเหลือได้<br /><br />สามารถเช็คดูที่ได้ <a href="https://hello-helper-66225d.netlify.app/request/${req.body.title}/${result.id}">ที่นี่</a>`,
                  });
                }
              }
            });
            return result.get();
          })
          .then(async (result) => {
            const user = await db
              .collection("users")
              .doc(result.data().userId)
              .get();
            return res.status(200).send({
              id: result.id,
              ...result.data(),
              user: {
                imageUrl: user.data().imageUrl,
                recommend: user.data().recommend,
                rank: user.data().rank,
                username: user.data().username,
                email: user.data().email,
                rating: user.data().rating,
              },
            });
          });
      })
      .catch((error) => {
        console.error("Error while verifying Firebase ID token:", error);
        res.status(403).send("Unauthorized");
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addRequesterUserId = async (req, res, next) => {
  try {
    const isExistData = await db
      .collection("requests")
      .doc(req.params.requestId)
      .collection("requesterUserId")
      .where("userId", "==", req.body.userId)
      .get();

    if (isExistData.size > 0) {
      res.status(400).send("you already send request");
    } else {
      // const request = await db
      //   .collection("requests")
      //   .doc(req.params.requestId)
      //   .get();

      return await db
        .collection("requests")
        .doc(req.params.requestId)
        .collection("requesterUserId")
        .add({
          userId: req.body.userId,
          createdAt: admin.firestore.Timestamp.now(),
          createdBy: req.params.userId,
          dataStatus: 0,
        })
        .then(async (result) => {
          res.status(200).send(result.id);
          return await db
            .collection("requests")
            .doc(req.params.requestId)
            .collection("requesterUserId")
            .get();
        })
        .then(async (result) => {
          const entities = [];

          result.docs.forEach((doc) => {
            entities.push({ requestId: doc.id, ...doc.data() });
          });
          // res.status(200).send(entities);
          const user = await db
            .collection("users")
            .doc(result.data().userId)
            .get();
          let authData = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              // user: testAccount.user,
              // pass: testAccount.pass,
            },
          });
          await authData.sendMail({
            from: "Hello Helper<accounts@franciscoinoque.tech>",
            to: user.data().email,
            subject: "มีคนต้องการให้ความช่วยเหลือ",
            html: `สวัสดี<br /><br />เราพบว่ามีผู้ต้องการให้ความช่วยเหลือตรงกับสิ่งที่คุณร้องขอ<br /><br />สามารถเช็คดูที่ได้ <a href="https://hello-helper-66225d.netlify.app/${result.title}/${result.id}">ที่นี่</a>`,
          });
        });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addProvidedUserId = async (req, res, next) => {
  try {
    const data = await db
      .collection("requests")
      .doc(req.params.requestId)
      .collection("providedUserId")
      .get();

    if (data.size > 0) {
      res.status(400).send("already have provided");
    } else {
      await db
        .collection("requests")
        .doc(req.params.requestId)
        .collection("providedUserId")
        .add({
          userId: req.body.userId,
          status: "waiting",
          createdAt: admin.firestore.Timestamp.now(),
          createdBy: req.params.userId,
          dataStatus: 0,
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
        modifiedAt: admin.firestore.Timestamp.now(),
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
    return await data
      .update({
        ...req.body,
        modifiedAt: admin.firestore.Timestamp.now(),
        modifiedBy: req.body.userId,
      })
      .then(() => {
        return data.get();
      })
      .then(async (data) => {
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
          res.status(404).send("No request found");
        } else {
          entities.push({ requestId: id, ...data.data() });
          await Promise.all(
            requesterUserId.docs.map(async (doc) => {
              const user = await db
                .collection("users")
                .doc(doc.data().userId)
                .get();
              const requesterUser = new RequesterUserId(
                doc.id,
                doc.data().userId,
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
              doc.id,
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
            providedUserEntities.push(providedUser);
          });
          Object.assign(...entities, {
            providedUserId: providedUserEntities,
          });
          res.status(200).send(...entities);
        }
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const disableRequest = async (req, res, next) => {
  try {
    const data = db.collection("requests").doc(req.params.id);
    await data.update({
      deletedAt: admin.firestore.Timestamp.now(),
      deletedBy: req.body.userId,
      dataStatus: 1,
    });
    res.status(200).send("disable successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteRequest = async (req, res, next) => {
  try {
    await db.collection("requests").doc(req.params.id).delete();
    res.status(200).send("deleted successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteRequesterUserId = async (req, res, next) => {
  try {
    await db
      .collection("requests")
      .doc(req.params.requestId)
      .collection("requesterUserId")
      .doc(req.params.requesterId)
      .delete();

    res.status(200).send("delete requesterUserId successfully");
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
            destination: `requests/${imageFileName}`,
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
          .file(`requests/${imageFileName}`)
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
  const file = bucket.file(`requests/${req.params.id}`);
  file.download().then((downloadResponse) => {
    res.status(200).send(downloadResponse[0]);
  });
};

//delete collection providedUserId
const deleteProvideUserId = async (req, res, next) => {
  const collectionRef = db
    .collection("requests")
    .doc(req.params.requestId)
    .collection("providedUserId");
  const query = collectionRef.orderBy("createdAt");

  async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
      // When there are no documents left, we are done
      resolve();
      return res.status(200).send("deleted providedUserId successfully");
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
      deleteQueryBatch(db, query, resolve);
    });
  }

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch((error) => {
      return res.status(400).send(error.message);
    });
  });
};

module.exports = {
  getRequests,
  getRequest,
  getSuggestRequests,
  getUserRequest,
  addRequest,
  addRequesterUserId,
  addProvidedUserId,
  updateProvidedStatus,
  updatedRequest,
  disableRequest,
  deleteRequest,
  deleteProvideUserId,
  deleteRequesterUserId,
  uploadImage,
  getImage,
};
