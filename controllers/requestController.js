const db = require("../db");
const {
  Request,
  ProvidedUserId,
  RequesterUserId,
} = require("../models/request");

const getRequests = async (req, res, next) => {
  try {
    const entities = [];
    const requesterUserEntities = [];
    const providedUserEntities = [];
    const data = await db.collection("requests").get();

    if (data.empty) {
      res.status(404).send("No request found");
    } else {
      await Promise.all(
        data.docs.map(async (doc) => {
          const id = doc.id;
          const request = new Request(
            id,
            doc.data().title,
            doc.data().location,
            doc.data().imageUrl,
            doc.data().description,
            doc.data().price,
            doc.data().serviceCharge
          );

          const requesterUserId = await db
            .collection("requests")
            .doc(id)
            .collection("requesterUserId")
            .get();

          requesterUserId.forEach((doc) => {
            const requesterUser = new RequesterUserId(
              doc.data().userId,
              doc.data().createdAt,
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
              doc.data().createdAt,
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
        })
      );
    }
    res.status(200).send(entities);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getRequest = async (req, res, next) => {
  try {
    const data = await db.collection("requests").doc(req.params.id).get();
    const id = data.id;
    const entities = [];

    if (data.empty) {
      res.status(404).send("No user found");
    } else {
      entities.push({ requestId: id, ...data.data() });
    }
    res.status(200).send(entities);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addRequest = async (req, res, next) => {
  try {
    db.collection("requests").add({
      ...req.body,
      createAt: req.body.createdAt,
      createdBy: req.body.createdBy,
      modifiedAt: req.body.modifiedAt,
      modifiedBy: req.body.modifiedBy,
      deletedAt: req.body.deletedAt,
      deletedBy: req.body.deletedBy,
      dataStatus: 0,
    });
    res.status(200).send("request created successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addRequesterUserId = async (req, res, next) => {
  try {
    const data = db
      .collection("requests")
      .doc(req.params.id)
      .collection("requesterUserId");
    await data.add({
      userId: req.body.userId,
      createAt: req.body.createdAt,
      createdBy: req.body.createdBy,
      modifiedAt: req.body.modifiedAt,
      modifiedBy: req.body.modifiedBy,
      deletedAt: req.body.deletedAt,
      deletedBy: req.body.deletedBy,
    });
    res.status(200).send("added requester successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addProvidedUserId = async (req, res, next) => {
  try {
    const data = db
      .collection("requests")
      .doc(req.params.id)
      .collection("providedUserId");
    await data.add({
      userId: req.body.userId,
      status: "waiting",
      createAt: req.body.createdAt,
      createdBy: req.body.createdBy,
      modifiedAt: req.body.modifiedAt,
      modifiedBy: req.body.modifiedBy,
      deletedAt: req.body.deletedAt,
      deletedBy: req.body.deletedBy,
    });

    res.status(200).send("add provided successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//ลิ้งค์กับตอน update order เพื่อนับยอด
const updateProvidedStatus = async (req, res, next) => {
  try {
    const data = db
      .collection("requests")
      .doc(req.params.id)
      .collection("providedUserId");

    await data.update({
      status: req.body.status,
      modifiedAt: req.body.modifiedAt,
      modifiedBy: req.body.modifiedBy,
    });

    res.status(200).send("update provided successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getRequests,
  getRequest,
  addRequest,
  addRequesterUserId,
  addProvidedUserId,
  updateProvidedStatus,
};
