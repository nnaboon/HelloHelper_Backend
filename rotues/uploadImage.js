const Multer = require("multer");
const express = require("express");

const router = express.Router();

const { uploadImage } = require("../controllers/uploadImageController");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/upload", multer.single("img"), uploadImage);

module.exports = {
  routes: router,
};
