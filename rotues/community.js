const Multer = require("multer");

const {
  getCommunities,
  getCommunity,
  addCommunity,
  joinedCommunityRequest,
  updateMemberRole,
  addMember,
  updateJoinedCommunityRequest,
  updateCommunity,
  deleteCommunity,
  bannedMember,
  getCommunityRequest,
  getCommunityProvide,
  uploadImage,
  getImage,
} = require("../controllers/communityController");
const express = require("express");

const router = express.Router();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get("/", getCommunities);
router.get("/:id", getCommunity);
router.get("/request/:id", getCommunityRequest);
router.get("/provide/:id", getCommunityProvide);
router.get("image/:id", getImage);

router.post("/", addCommunity);
router.put("/", updateCommunity);
router.post("/member/:id", addMember);
router.post("/join", joinedCommunityRequest);
router.post("/upload/:id", multer.single("img"), uploadImage);

router.put("/delete/:id", deleteCommunity);
router.put("/member/:communityId/:memberId", updateMemberRole);
router.put("/banned/:communityId/:memberId", bannedMember);
router.put("/join/:id", updateJoinedCommunityRequest);

module.exports = {
  routes: router,
};
