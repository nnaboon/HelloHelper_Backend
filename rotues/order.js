const {
  getOrders,
  getOrder,
  addOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const express = require("express");

const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrder);

router.post("/", addOrder);

router.put("/:id", updateOrder);
router.put("/delete/:id", updateOrder);

module.exports = {
  routes: router,
};
