const express = require("express");
const {
  addUsers,
  getAllUser,
  updateUserData,
} = require("../controllers/usersController");

const router = express.Router();

router.get("/users", getAllUser);
router.post("/users", addUsers);
router.post("/users/:id", updateUserData);

module.exports = {
  routes: router,
};
