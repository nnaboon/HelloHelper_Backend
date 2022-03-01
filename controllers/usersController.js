const db = require("../db");
const User = require("../models/user");
const moment = require("moment");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const fs = require("fs");

const storage = admin.storage();
const bucket = storage.bucket();

let fields = {};
const BusBoy = require("busboy");
const path = require("path");
const os = require("os");

const verifyToken = async (req, res, next) => {
  try {
    // admin
    //   .auth()
    //   .verifyIdToken(req.body.idToken)
    //   .then((response) => {
    //     res.status(200).send(response);
    //   })
    //   .catch((error) => {
    //     res.status(400).send(error.message);
    //   });
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
        res.status(200).send(decodedIdToken.uid);
      })
      .catch((error) => {
        console.error("Error while verifying Firebase ID token:", error);
        res.status(403).send("Unauthorized");
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const signin = async (req, res, next) => {
  try {
    const idToken = req.body.idToken.toString();

    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    admin
      .auth()
      .createSessionCookie(idToken, { expiresIn })
      .then(
        (sessionCookie) => {
          const options = { maxAge: expiresIn, httpOnly: true };
          res.cookie("session", sessionCookie, options);
          res.status(200).send(JSON.stringify({ status: "success" }));
        },
        (error) => {
          res.status(401).send("UNAUTHORIZED REQUEST!");
        }
      );
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
// add new user after verified
const addUsers = async (req, res, next) => {
  try {
    await db
      .collection("users")
      .doc(req.body.userId)
      .set({
        loginType: req.body.loginType,
        username: req.body.username,
        email: req.body.email,
        verifiedEmailStatus: 1,
        location: req.body.location,
        imageUrl: req.body.imageUrl,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        recommend: 0,
        rank: "classic",
        rating: 0,
        category: req.body.category,
        requestSum: 0,
        provideSum: 0,
        followerUserId: 0,
        followingUserId: 0,
        createdAt: admin.firestore.Timestamp.now(),
        createdBy: req.body.userId,
        dataStatus: 0,
      })
      .then(async (res) => {
        return await db.collection("users").doc(req.body.userId).get();
      })
      .then((result) => {
        res.status(200).send({ userId: result.id, ...result.data() });
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// update user data
const updateUserData = async (req, res, next) => {
  try {
    const document = db.collection("users").doc(req.params.id);
    document
      .update({
        ...req.body,
        modifiedAt: admin.firestore.Timestamp.now(),
        modifiedBy: req.body.userId,
      })
      .then(async () => {
        const data = await db.collection("users").doc(req.params.id).get();
        res.status(200).send({ userId: req.params.id, ...data.data() });
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// const updateProvideSum = async (req, res, next) => {
//   try {
//     const provideSumPrev = await db
//       .collection("users")
//       .doc(req.params.id)
//       .get();

//     await db
//       .collection("users")
//       .doc(req.params.id)
//       .update({
//         provideSum: provideSumPrev.data().provideSum + 1,
//       }).then((res) => {

//       });
//     res.status(200).send("provideSum updated successfully");
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

// const updateRequestSum = async (req, res, next) => {
//   try {
//     const requestSumPrev = await db
//       .collection("users")
//       .doc(req.params.id)
//       .get();

//     await db
//       .collection("users")
//       .doc(req.params.id)
//       .update({
//         requestSum: requestSumPrev.data().requestSum + 1,
//       });
//     res.status(200).send("requestSum updated successfully");
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

const deleteUser = async (req, res, next) => {
  try {
    const document = db.collection("users").doc(req.params.id);
    await document.update({
      deletedAt: admin.firestore.Timestamp.now(),
      deletedBy: req.params.id,
      dataStatus: 1,
    });
    res.status(200).send("User has deleted");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//get all user data
const getUsers = async (req, res, next) => {
  try {
    const data = await db.collection("users").get();
    const entities = [];

    if (data.empty) {
      res.status(404).send("No user found");
    } else {
      data.forEach((doc) => {
        const user = new User(
          doc.id,
          doc.data().loginType,
          doc.data().username,
          doc.data().email,
          doc.data().verifiedEmailStatus,
          doc.data().location,
          doc.data().imageUrl,
          doc.data().address,
          doc.data().phoneNumber,
          doc.data().recommend,
          doc.data().rank,
          doc.data().rating,
          doc.data().communityId,
          doc.data().category,
          doc.data().requestSum,
          doc.data().provideSum,
          doc.data().followerUserId,
          doc.data().followingUserId,
          doc.data().provideId,
          doc.data().requestId,
          doc.data().createdBy,
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
        entities.push(user);
      });
    }

    res.status(200).send(entities);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateUserVerificationEmailStatus = async (req, res, next) => {
  try {
    const document = db.collection("users").doc(req.params.id);
    await document.update({
      verifiedEmailStatus: req.body.verifiedEmailStatus,
      modifiedAt: admin.firestore.Timestamp.now(),
      modifiedBy: req.body.userId,
    });
    res.status(200).send("verification email status has been update");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const createUser = async (req, res, next) => {
  // await admin
  //   .auth()
  //   .createUser({ email: req.body.email, password: req.body.password })
  //   .then(async (userRecord) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "srisawasdina@gmail.com",
      pass: "na21122542",
    },
  });

  await admin
    .auth()
    .generateEmailVerificationLink(req.body.email)
    .then(async (emailLink) => {
      await await transporter.sendMail({
        from: "Hello Helper<accounts@franciscoinoque.tech>",
        to: req.body.email,
        subject: "Email Verification",
        html: `Hello User, to verify your email please , <a href=${emailLink}> click here </a>`,
      });

      return await res
        .status(200)
        .send("please check in your inbox, we sent verification email");
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
  // })
  // .catch((error) => {
  //   res.status(400).send(error.message);
  // });
};

const followUserId = async (req, res, next) => {
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
          .collection("users")
          .doc(decodedIdToken.uid)
          .collection("followings")
          .add({
            userId: req.params.userId,
            createdAt: admin.firestore.Timestamp.now(),
            createdBy: decodedIdToken.uid,
            dataStatus: 0,
          });

        await db
          .collection("users")
          .doc(req.params.userId)
          .collection("followers")
          .add({
            userId: decodedIdToken.uid,
            createdAt: admin.firestore.Timestamp.now(),
            createdBy: decodedIdToken.uid,
            dataStatus: 0,
          })
          .then((result) => {
            //   return await db
            //     .collection("users")
            //     .doc(decodedIdToken.uid)
            //     .doc(req.params.userId)
            //     .collection("follower")
            //     .get();
            // })
            // .then((result) => {
            //   const entities = [];
            //   result.docs.forEach((doc) => {
            //     entities.push({ followerId: doc.id, ...doc.data() });
            //   });
            res.status(200).send(result.id);
          })
          .catch((error) => {
            res.status(400).send(error.message);
          });
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const unfollowUserId = async (req, res, next) => {
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
        const followingData = await db
          .collection("users")
          .doc(decodedIdToken.uid)
          .collection("followings")
          .where("userId", "==", req.params.userId)
          .get();

        followingData.forEach((doc) => {
          doc.ref.delete();
        });

        const followerData = await db
          .collection("users")
          .doc(req.params.userId)
          .collection("followers")
          .where("userId", "==", decodedIdToken.uid)
          .get();

        followerData.forEach((doc) => {
          doc.ref.delete();
        });

        // .then(async (result) => {
        //   return await db
        //     .collection("users")
        //     .doc(decodedIdToken.uid)
        //     .collection("followers")
        //     .get();
        // })
        // .then((result) => {
        //   const entities = [];
        //   result.docs.forEach((doc) => {
        //     entities.push({ followerId: doc.id, ...doc.data() });
        //   });
        res.status(200).send("unfollow user successfully");
        // })
        // .catch((error) => {
        //   res.status(400).send(error.message);
        // });
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const sendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;
  const first_name = "Francisco";

  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "srisawasdina@gmail.com",
        pass: "na21122542",
      },
    });
    admin
      .auth()
      .generateEmailVerificationLink(email)
      .then(async (emailLink) => {
        await await transporter.sendMail({
          from: "Hello Helper<accounts@franciscoinoque.tech>",
          to: email,
          subject: "Email Verification",
          html: `Hello ${first_name}, to verify your email please , <a href=${emailLink}> click here </a>`,
        });

        return await res
          .status(200)
          .send("please check in your inbox, we sent verification email");
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//get selected user data
const getUser = async (req, res, next) => {
  try {
    const data = await db.collection("users").doc(req.params.id).get();
    const followerData = await db
      .collection("users")
      .doc(req.params.id)
      .collection("followers")
      .get();

    const followingData = await db
      .collection("users")
      .doc(req.params.id)
      .collection("followings")
      .get();

    let followerEntities = [];
    let followingEntities = [];

    if (data.exists) {
      followerData.docs.map((doc) => {
        followerEntities.push({ followerId: doc.id, ...doc.data() });
      });

      followingData.docs.map((doc) => {
        followingEntities.push({ followingId: doc.id, ...doc.data() });
      });

      res.status(200).send({
        userId: data.id,
        ...data.data(),
        followingUserId: followingEntities,
        followerUserId: followerEntities,
      });
    } else {
      res.status(200).send({});
    }
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
            destination: `users/${imageFileName}`,
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
          .file(`users/${imageFileName}`)
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
  const file = bucket.file(`users/${req.params.id}`);
  file.download().then((downloadResponse) => {
    res.status(200).send(downloadResponse[0]);
  });
};

const updateRank = async (req, res, next) => {
  try {
    const data = await db.collection("users").doc(req.params.id).get();

    if (data.data().rating >= 4) {
      switch (true) {
        case data.data().provideSum > 0 && data.data().provideSum < 50:
          await db.collection("users").doc(req.params.id).update({ rank: 1 });
          break;
        case data.data().provideSum >= 50 && data.data().provideSum < 100:
          await db.collection("users").doc(req.params.id).update({ rank: 100 });
          break;
        case data.data().provideSum >= 100 && data.data().provideSum < 200:
          await db.collection("users").doc(req.params.id).update({ rank: 3 });
          break;
        case data.data.provideSum >= 400 && data.data().rating >= 4.5:
          await db.collection("users").doc(req.params.id).update({ rank: 4 });
          break;
      }
      res.status(200).send("rank updated successfully");
    } else {
      res.status(200).send("same rank");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  signin,
  verifyToken,
  addUsers,
  getUsers,
  getUser,
  updateUserData,
  deleteUser,
  sendVerificationEmail,
  updateUserVerificationEmailStatus,
  createUser,
  followUserId,
  unfollowUserId,
  uploadImage,
  getImage,
  updateRank,
  // updateProvideSum,
  // updateRequestSum,
};
