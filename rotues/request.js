const Multer = require("multer");

const {
  getRequests,
  getRequest,
  getUserRequest,
  addRequest,
  addRequesterUserId,
  addProvidedUserId,
  updateProvidedStatus,
  updatedRequest,
  deletedRequest,
  deleteRequesterUserId,
  deleteProvideUserId,
  uploadImage,
  getImage,
} = require("../controllers/requestController");

const express = require("express");

const router = express.Router();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get("/", getRequests);
router.get("/:id", getRequest);
router.get("/:id/image", getImage);
router.get("/user/:userId", getUserRequest);

router.post("/", addRequest);
router.post("/:requestId/requester/:userId", addRequesterUserId);
router.post("/:requestId/provided/:userId", addProvidedUserId);
router.post("/upload", multer.single("img"), uploadImage);

router.put("/:id", updatedRequest);
router.put("/:id/disable", deletedRequest);
router.put("/:requestId/provided/:providedId", updateProvidedStatus);
router.delete("/:requestId/requester/:requesterId", deleteRequesterUserId);
router.delete("/:requestId/provided", deleteProvideUserId);
module.exports = {
  routes: router,
};
