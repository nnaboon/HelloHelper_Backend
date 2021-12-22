const {
  // getCommunities,
  getCommunity,
  addCommunity,
  joinedCommunityRequest,
  updateMemberStatus,
  addMember,
  updateJoinedCommunityRequest,
  updateCommunity,
  deleteCommunity,
  bannedMember,
} = require("../controllers/communityController");
const express = require("express");

const router = express.Router();

// router.get("/", getCommunities);
router.get("/:id", getCommunity);
router.post("/", addCommunity);
router.put("/", updateCommunity);
router.post("/delete/:id", deleteCommunity);
router.post("/member/:id", addMember);
router.put("/member/:communityId/:memberId", updateMemberStatus);
router.put("/banned/:communityId/:memberId", bannedMember);
router.post("/join/:id", joinedCommunityRequest);
router.put("/join/:id", updateJoinedCommunityRequest);

module.exports = {
  routes: router,
};
