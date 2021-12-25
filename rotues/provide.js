const {
  getProvides,
  getProvide,
  addProvide,
  updatedProvide,
  deletedProvide,
  addRequesterUser,
} = require("../controllers/provideController");
const express = require("express");

const router = express.Router();

router.get("/", getProvides);
router.get("/:id", getProvide);

router.post("/", addProvide);
router.post("/requester/:id", addRequesterUser);

router.put("/:id", updatedProvide);
router.put("/delete/:id", deletedProvide);

module.exports = {
  routes: router,
};
