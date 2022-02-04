const Multer = require("multer");
const express = require("express");
const {
  signin,
  verifyToken,
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
router.get("image/:id", getImage);

router.post("/", addUsers);
router.post("/create", createUser);
router.post("/send-mail-ver", sendVerificationEmail);
router.post("/upload", multer.single("img"), uploadImage);
router.post("/login", signin);
router.post("/verify", verifyToken);

router.put("/rank/:id", updateRank);
router.put("/update-verification-status", updateUserVerificationEmailStatus);
router.put("/:id", updateUserData);
router.put("/delete/:id", deleteUser);

module.exports = {
  routes: router,
};
