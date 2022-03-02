const Multer = require("multer");
const path = require("path");

const {
  getProvides,
  getMyProvide,
  getProvide,
  getProvidesRanking,
  addProvide,
  updatedProvide,
  disableProvide,
  deleteProvide,
  addRequesterUser,
  uploadImage,
  getImage,
  updateProvideSum,
  searchProvide,
} = require("../controllers/provideController");

const express = require("express");

const router = express.Router();
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get("/", getProvides);
router.get("/:id", getProvide);
router.get("/user/:userId", getMyProvide);
router.get("/:id/image", getImage);
router.get("/:userId/rank", getProvidesRanking);
router.get("/search/:category", searchProvide);

router.post("/", addProvide);
router.post("/:provideId/requester/:userId", addRequesterUser);
router.post("/upload", multer.single("img"), uploadImage);

router.put("/:id", updatedProvide);
router.put("/:id/disable", disableProvide);
router.put("/:id/sum", updateProvideSum);

router.delete("/:id/delete", deleteProvide);

module.exports = {
  routes: router,
};
