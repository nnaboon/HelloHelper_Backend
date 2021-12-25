const db = require("../db");
const moment = require("moment");
const { Order } = require("../models/order");

const getOrders = async (req, res, next) => {
  try {
    const data = await db.collection("orders").get();
    const entities = [];

    if (data.empty) {
      res.status(404).send("No order found");
    } else {
      data.docs.map((doc) => {
        const order = new Order(
          doc.id,
          doc.data().orderReferenceType,
          doc.data().orderReferenceId,
          doc.data().title,
          doc.data().location,
          doc.data().description,
          doc.data().number,
          doc.data().price,
          doc.data().serviceCharge,
          doc.data().rating,
          doc.data().receiver,
          doc.data().requesterUserId,
          doc.data().providerUserId,
          doc.data().payment,
          doc.data().status,
          doc.data().createdAt,
          doc.data().createdBy,
          doc.data().modifiedAt,
          doc.data().modifiedBy,
          doc.data().deletedAt,
          doc.data().deletedBy,
          doc.data().dataStatus
        );

        entities.push(order);
      });
      res.status(200).send(entities);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const data = await db.collection("orders").doc(req.params.id).get();
    const id = data.id;
    const entities = [];

    if (data.empty) {
      res.status(404).send("No order found");
    } else {
      entities.push({ id: id, ...data.data() });
      res.status(200).send(entities);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addOrder = async (req, res, next) => {
  try {
    await db.collection("orders").add({
      ...req.body,
      status: "waiting",
      createAt: moment().toISOString(),
      createdBy: req.body.userId,
      dataStatus: 0,
    });
    res.status(200).send("add order successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    await db
      .collection("orders")
      .doc(req.params.id)
      .update({
        ...req.body,
        modifiedAt: moment().toISOString(),
        modifiedBy: req.body.userId,
        dataStatus: 0,
      });
    res.status(200).send("updated order successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    await db.collection("orders").doc(req.params.id).update({
      deletedAt: moment().toISOString(),
      deletedBy: req.body.userId,
      dataStatus: 1,
    });
    res.status(200).send("updated order successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getOrders,
  getOrder,
  addOrder,
  updateOrder,
  deleteOrder,
};
