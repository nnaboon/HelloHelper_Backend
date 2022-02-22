const Multer = require("multer");

const {
  getCommunities,
  getCommunity,
  getCommunityMember,
  getMyCommunity,
  getCommunityJoinedRequest,
  addCommunity,
  addJoinedCommunityRequest,
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
  leaveCommunity,
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
router.get("/:id/member", getCommunityMember);
router.get("/user/:userId", getMyCommunity);
router.get("/:id/request", getCommunityRequest);
router.get("/:id/provide", getCommunityProvide);
router.get("image/:id", getImage);
router.get("/:id/join", getCommunityJoinedRequest);

router.post("/", addCommunity);
router.post("/:id/member", addMember);
router.post("/join", addJoinedCommunityRequest);
router.post("/upload", multer.single("img"), uploadImage);

router.put("/:id", updateCommunity);
router.put("/:communityId/member/:memberId", updateMemberRole);
router.put("/:communityId/ban/:memberId", bannedMember);
router.put("/:id/join", updateJoinedCommunityRequest);
router.put("/:id/disable", deleteCommunity);

module.exports = {
  routes: router,
};
