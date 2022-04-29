const {
  getOrders,
  getOrder,
  getWaitForConfirmOrders,
  getMyRequestOrders,
  getMyProvideOrders,
  addOrder,
  updateOrderStatus,
  disableOrder,
  updateProvideSum,
  updateRequestSum,
  deleteConfirmOrder,
  requesterRating,
} = require("../controllers/orderController");
const express = require("express");

const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrder);
router.get("/confirm/:id", getWaitForConfirmOrders);
router.get("/request/:userId", getMyRequestOrders);
router.get("/provide/:userId", getMyProvideOrders);

router.post("/", addOrder);

router.put("/:id/status", updateOrderStatus);
router.put("/:id/disable", disableOrder);
router.put("/:id/sum/provide", updateProvideSum);
router.put("/:id/sum/request", updateRequestSum);
router.put("/:id/requester", requesterRating);

router.delete("/confirm/:id", deleteConfirmOrder);

module.exports = {
  routes: router,
};
