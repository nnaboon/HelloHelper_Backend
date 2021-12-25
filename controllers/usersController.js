const db = require("../db");
const User = require("../models/user");
const moment = require("moment");

// add new user
const addUsers = async (req, res, next) => {
  try {
    db.collection("users").add({
      loginType: req.body.loginType,
      username: req.body.username,
      email: req.body.email,
      verifiedEmailStatus: req.body.verifiedEmailStatus,
      location: req.body.location,
      imageUrl: req.body.imageUrl,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      recommend: 0,
      rank: 0,
      rating: 0,
      communityId: undefined,
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
module.exports = {
  addUsers,
  getUsers,
  getUser,
  updateUserData,
  deleteUser,
};
