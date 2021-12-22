const express = require("express");
const {
  addUsers,
  getUsers,
  getUser,
  updateUserData,
  deleteUser,
} = require("../controllers/usersController");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", addUsers);
router.put("/:id", updateUserData);
router.post("/delete/:id", deleteUser);

module.exports = {
  routes: router,
};
