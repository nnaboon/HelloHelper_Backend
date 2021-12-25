const db = require("../db");
const { Provide, RequesterUserId } = require("../models/provide");
const moment = require("moment");

const getProvides = async (req, res, next) => {
  try {
    const data = await db.collection("provides").get();

    const entities = [];

    if (data.empty) {
      res.status(404).send("No provide found");
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
            doc.data().serviceCharge,
            doc.data().userId,
            doc.data().communityId
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
    }
    res.status(200).send(entities);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getProvide = async (req, res, next) => {
  try {
    const data = await db.collection("provides").doc(req.params.id).get();
    const id = data.id;
    const entities = [];
    const requesterUserEntities = [];

    if (data.empty) {
      res.status(404).send("No user found");
    } else {
      const requesterUserId = await db
        .collection("provides")
        .doc(id)
        .collection("requesterUserId")
        .get();

      requesterUserId.forEach((doc) => {
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
      entities.push({ provideId: id, ...data.data() });

      Object.assign(...entities, {
        requesterUserId: requesterUserEntities,
      });
    }
    res.status(200).send(entities);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addProvide = async (req, res, next) => {
  try {
    db.collection("provides").add({
      ...req.body,
      createAt: moment().toISOString(),
      createdBy: req.body.userId,
      modifiedAt: moment().toISOString(),
      modifiedBy: req.body.userId,
      dataStatus: 0,
    });
    res.status(200).send("provide created successfully");
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

module.exports = {
  getProvides,
  getProvide,
  addProvide,
  updatedProvide,
  deletedProvide,
  addRequesterUser,
};
