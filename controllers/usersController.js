const db = require("../db");
const User = require("../models/user");
const moment = require("moment");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

const storage = admin.storage();
const bucket = storage.bucket();

// add new user after verified
const addUsers = async (req, res, next) => {
  try {
    db.collection("users").add({
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
      provideId: 0,
      requestId: 0,
      createAt: moment().toISOString(),
      createdBy: req.body.userId,
      dataStatus: 0,
    });
    res.status(200).send("User created");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// update user data
const updateUserData = async (req, res, next) => {
  try {
    const document = db.collection("users").doc(req.params.id);
    await document.update({
      ...req.body,
      modifiedAt: moment().toISOString(),
      modifiedBy: req.body.userId,
    });
    res.status(200).send("User update");
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
      deletedAt: moment().toISOString(),
      deletedBy: req.body.userId,
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
          doc.data().createdAt,
          doc.data().modifiedAt,
          doc.data().modifiedBy,
          doc.data().deletedAt,
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
      modifiedAt: moment().toISOString(),
      modifiedBy: req.body.userId,
    });
    res.status(200).send("verification email status has been update");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const createUser = async (req, res, next) => {
  await admin
    .auth()
    .createUser({ email: req.body.email, password: req.body.password })
    .then(async (userRecord) => {
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
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
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
    const id = data.id;
    const entities = [];

    if (data.empty) {
      res.status(404).send("No user found");
    } else {
      entities.push({ userId: id, ...data.data() });
    }
    res.status(200).send(entities);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const uploadImage = async (req, res, next) => {
  const folder = "users";
  const fileName = `${folder}/${Date.now()}`;
  const fileUpload = bucket.file(fileName);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  blobStream.on("error", (err) => {
    res.status(405).json(err);
  });

  blobStream.on("finish", () => {
    res.status(200).send("Upload complete!");
  });

  blobStream.end(req.file.buffer);
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
    } else {
      res.status(200).send("same rank");
    }

    res.status(200).send("rank updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addUsers,
  getUsers,
  getUser,
  updateUserData,
  deleteUser,
  sendVerificationEmail,
  updateUserVerificationEmailStatus,
  createUser,
  uploadImage,
  getImage,
  updateRank,
  // updateProvideSum,
  // updateRequestSum,
};
