const {
  getCommunities,
  getCommunity,
  addCommunity,
  joinedCommunityRequest,
  updateMemberStatus,
  addMember,
  updateJoinedCommunityRequest,
  updateCommunity,
  deleteCommunity,
  bannedMember,
  getCommunityRequest,
  getCommunityProvide,
} = require("../controllers/communityController");
const express = require("express");

const router = express.Router();

router.get("/", getCommunities);
router.get("/:id", getCommunity);
router.get("/request/:id", getCommunityRequest);
router.get("/provide/:id", getCommunityProvide);

router.post("/", addCommunity);
router.put("/", updateCommunity);
router.post("/member:id", addMember);
router.post("/join", joinedCommunityRequest);

router.put("/delete/:id", deleteCommunity);
router.put("/member/:communityId/:memberId", updateMemberStatus);
router.put("/banned/:communityId/:memberId", bannedMember);
router.put("/join/:id", updateJoinedCommunityRequest);

module.exports = {
  routes: router,
};
