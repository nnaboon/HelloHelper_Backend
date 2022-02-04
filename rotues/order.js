const {
  getOrders,
  getOrder,
  getMyRequestOrders,
  getMyProvideOrders,
  addOrder,
  updateOrderStatus,
  deleteOrder,
  updateProvideSum,
  updateRequestSum,
} = require("../controllers/orderController");
const express = require("express");

const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrder);
router.get("/request/:userId", getMyRequestOrders);
router.get("/provide/:userId", getMyProvideOrders);

router.post("/", addOrder);

router.put("/status/:id", updateOrderStatus);
router.put("/delete/:id", deleteOrder);
router.put("/sum/provide", updateProvideSum);
router.put("/sum/request", updateRequestSum);

module.exports = {
  routes: router,
};
