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
  disableRequest,
  deleteRequest,
  deleteRequesterUserId,
  deleteProvideUserId,
  uploadImage,
  getImage,
  getSuggestRequests,
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
router.get("/top/suggest", getSuggestRequests);
router.get("/user/:userId", getUserRequest);

router.post("/", addRequest);
router.post("/:requestId/requester/:userId", addRequesterUserId);
router.post("/:requestId/provided/:userId", addProvidedUserId);
router.post("/upload", multer.single("img"), uploadImage);

router.put("/:id", updatedRequest);
router.put("/:id/disable", disableRequest);
router.put("/:requestId/provided/:providedId", updateProvidedStatus);
router.delete("/:id/delete", deleteRequest);
router.delete("/:requestId/requester/:requesterId", deleteRequesterUserId);
router.delete("/:requestId/provided", deleteProvideUserId);
module.exports = {
  routes: router,
};
