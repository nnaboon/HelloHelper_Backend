const db = require("../db");
const User = require("../models/users");

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
      recommend: req.body.recommend,
      rank: req.body.rank,
      rating: req.body.rating,
      communityId: req.body.communityId,
      category: req.body.category,
      requestSum: req.body.requestSum,
      provideSum: req.body.provideSum,
      followerUserId: req.body.followerUserId,
      followingUserId: req.body.followingUserId,
      provideId: req.body.provideId,
      requestId: req.body.requestId,
      createAt: req.body.createdAt,
      createdBy: req.body.createdBy,
      modifiedAt: req.body.modifiedAt,
      modifiedBy: req.body.modifiedBy,
      deletedAt: req.body.deletedAt,
      deletedBy: req.body.deletedBy,
      dataStatus: req.body.dataStatus,
    });
    res.status(200).send("User created");
  } catch (error) {
    res.status(500).send(error);
  }
};

// update user data
const updateUserData = async (req, res, next) => {
  try {
    const document = db.collection("users").doc(req.params.id);
    await document.update({
      [req.body.field]: req.body.updateData,
    });

    return res.status(200).send("User update");
  } catch (error) {
    return res.status(500).send(error);
  }
};

//get all user data
const getAllUser = async (req, res, next) => {
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

module.exports = {
  addUsers,
  getAllUser,
  updateUserData,
};
