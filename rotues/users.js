const Multer = require("multer");
const express = require("express");
const {
  addUsers,
  getUsers,
  getUser,
  updateUserData,
  deleteUser,
  sendVerificationEmail,
  updateUserVerificationEmailStatus,
  createUser,
  getImage,
  uploadImage,
  updateRank,
} = require("../controllers/usersController");

const router = express.Router();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", addUsers);
router.get("image/:id", getImage);

router.post("/create", createUser);
router.post("/send-mail-ver", sendVerificationEmail);
router.post("/upload", multer.single("img"), uploadImage);

router.put("/rank/:id", updateRank);
router.put("/update-verification-status", updateUserVerificationEmailStatus);
router.put("/:id", updateUserData);
router.put("/delete/:id", deleteUser);

module.exports = {
  routes: router,
};
