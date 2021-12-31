const Multer = require("multer");

const {
  getProvides,
  getProvide,
  addProvide,
  updatedProvide,
  deletedProvide,
  addRequesterUser,
  uploadImage,
  getImage,
  updateProvideSum,
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
router.get("image/:id", getImage);

router.post("/", addProvide);
router.post("/requester/:id", addRequesterUser);
router.post("/upload", multer.single("img"), uploadImage);

router.put("/:id", updatedProvide);
router.put("/delete/:id", deletedProvide);
router.put("/sum/:id", updateProvideSum);

module.exports = {
  routes: router,
};
