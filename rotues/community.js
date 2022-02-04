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
router.get("/member/:id", getCommunityMember);
router.get("/me", getMyCommunity);
router.get("/request/:id", getCommunityRequest);
router.get("/provide/:id", getCommunityProvide);
router.get("image/:id", getImage);

router.post("/", addCommunity);
router.post("/member/:id", addMember);
router.post("/join", addJoinedCommunityRequest);
router.post("/upload/:id", multer.single("img"), uploadImage);
router.get("/join/:id", getCommunityJoinedRequest);

router.put("/:id", updateCommunity);
router.put("/member/:communityId/:memberId", updateMemberRole);
router.put("/ban/:communityId/:memberId", bannedMember);
router.put("/update/join/:id", updateJoinedCommunityRequest);
router.put("/delete/:id", deleteCommunity);

module.exports = {
  routes: router,
};
