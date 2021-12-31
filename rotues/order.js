const {
  getOrders,
  getOrder,
  addOrder,
  updateOrder,
  deleteOrder,
  updateProvideSum,
  updateRequestSum,
} = require("../controllers/orderController");
const express = require("express");

const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrder);

router.post("/", addOrder);
router.post("/provide", updateProvideSum);
router.post("/request", updateRequestSum);

router.put("/:id", updateOrder);
router.put("/delete/:id", deleteOrder);

module.exports = {
  routes: router,
};
