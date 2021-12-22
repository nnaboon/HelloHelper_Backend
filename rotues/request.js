const {
  getRequests,
  getRequest,
  addRequest,
  addRequesterUserId,
  addProvidedUserId,
  updateProvidedStatus,
} = require("../controllers/requestController");
const express = require("express");

const router = express.Router();

router.get("/", getRequests);
router.get("/:id", getRequest);

router.post("/", addRequest);
router.post("/requester/:id", addRequesterUserId);
router.post("/provided/:id", addProvidedUserId);
router.put("/provided/:id", updateProvidedStatus);

module.exports = {
  routes: router,
};
