const Multer = require("multer");

const {
  getRequests,
  getRequest,
  addRequest,
  addRequesterUserId,
  addProvidedUserId,
  updateProvidedStatus,
  updatedRequest,
  deletedRequest,
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
router.get("image/:id", getImage);

router.post("/", addRequest);
router.post("/requester/:id", addRequesterUserId);
router.post("/provided/:id", addProvidedUserId);
router.post("/upload", multer.single("img"), uploadImage);

router.put("/:id", updatedRequest);
router.put("/delete/:id", deletedRequest);
router.put("/provided/:id", updateProvidedStatus);

module.exports = {
  routes: router,
};
