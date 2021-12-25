const db = require("../db");
const { Provide, RequesterUserId } = require("../models/provide");
const { Request, ProvidedUserId } = require("../models/request");
const { Community, Member, JoinedRequest } = require("../models/community");

const getCommunities = async (req, res, next) => {
  try {
    const data = await db.collection("communities").get();

    const entities = [];

    if (data.empty) {
      res.status(404).send("No user found");
    } else {
      await Promise.all(
        data.docs.map(async (doc) => {
          const id = doc.id;
          const user = new Community(
            id,
            doc.data().communityCode,
            doc.data().communityName,
            doc.data().imageUrl,
            doc.data().location,
            doc.data().description,
            doc.data().imageUrl,
            doc.data().createdBy,
            doc.data().createdAt,
            doc.data().modifiedAt,
            doc.data().modifiedBy,
            doc.data().deletedAt,
            doc.data().deletedBy,
            doc.data().dataStatus
          );

          const memberEntities = [];
          const joinedRequestEntities = [];

          const members = await db
            .collection("communities")
            .doc(id)
            .collection("member")
            .get();

          if (members.empty) {
            res.status(404).send("No user found");
          } else {
            members.forEach((doc) => {
              const member = new Member(
                doc.id,
                doc.data().status,
                doc.data().role,
                doc.data().requestSum,
                doc.data().provideSum,
                doc.data().joinedAt,
                doc.data().leavedAt
              );
              memberEntities.push(member);
            });
            Object.assign(user, { member: memberEntities });
          }

          const joinedRequest = await db
            .collection("communities")
            .doc(id)
            .collection("joinedRequestUserId")
            .get();

          if (joinedRequest.empty) {
            res.status(404).send("No user found");
          } else {
            joinedRequest.forEach((doc) => {
              const joinedRequest = new JoinedRequest(
                doc.id,
                doc.data().status,
                doc.data().role,
                doc.data().createdBy,
                doc.data().createdAt,
                doc.data().modifiedAt,
                doc.data().modifiedBy,
                doc.data().deletedAt,
                doc.data().deletedBy,
                doc.data().dataStatus
              );
              joinedRequestEntities.push(joinedRequest);
            });
            Object.assign(user, {
              joinedRequestUserId: joinedRequestEntities,
            });
          }
          entities.push(user);
        })
      );
    }
    res.status(200).send(entities);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getCommunity = async (req, res, next) => {
  try {
    const data = await db.collection("communities").doc(req.params.id).get();
    const id = data.id;

    const members = await db
      .collection("communities")
      .doc(req.params.id)
      .collection("member")
      .get();
    const joinedRequest = await db
      .collection("communities")
      .doc(req.params.id)
      .collection("joinedRequestUserId")
      .get();

    const entities = [];
    const memberEntities = [];
    const joinedRequestEntities = [];

    if (data.empty) {
      res.status(404).send("No user found");
    } else {
      entities.push({ communityId: id, ...data.data() });

      if (members.empty) {
        res.status(404).send("No user found");
      } else {
        members.forEach((doc) => {
          const member = new Member(
            doc.id,
            doc.data().status,
            doc.data().role,
            doc.data().requestSum,
            doc.data().provideSum,
            doc.data().joinedAt,
            doc.data().leavedAt
          );
          memberEntities.push(member);
        });
        Object.assign(...entities, { member: memberEntities });
      }

      if (joinedRequest.empty) {
        res.status(404).send("No user found");
      } else {
        joinedRequest.forEach((doc) => {
          const joinedRequest = new JoinedRequest(
            doc.id,
            doc.data().status,
            doc.data().role,
            doc.data().createdBy,
            doc.data().createdAt,
            doc.data().modifiedAt,
            doc.data().modifiedBy,
            doc.data().deletedAt,
            doc.data().deletedBy,
            doc.data().dataStatus
          );
          joinedRequestEntities.push(joinedRequest);
        });
        Object.assign(...entities, {
          joinedRequestUserId: joinedRequestEntities,
        });
      }
    }
    res.status(200).send(entities);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getCommunityRequest = async (req, res, next) => {
  try {
    const request = db.collection("requests");
    const allCommunityRequest = await request
      .where("communityId", "==", req.params.id)
      .get();

    const entities = [];

    await Promise.all(
      allCommunityRequest.docs.map(async (doc) => {
        const id = doc.id;
        const requestData = new Request(
          id,
          doc.data().title,
          doc.data().location,
          doc.data().imageUrl,
          doc.data().description,
          doc.data().price,
          doc.data().serviceCharge,
          doc.data().number,
          doc.data().payment,
          doc.data().userId,
          doc.data().communityId,
          doc.data().category,
          doc.data().hashtag,
          doc.data().providedUserId,
          doc.data().requesterUserId
        );

        const requesterUserEntities = [];
        const providedUserEntities = [];

        const requesterUserId = await db
          .collection("requests")
          .doc(id)
          .collection("requesterUserId")
          .get();

        requesterUserId.forEach((doc) => {
          const requesterUser = new RequesterUserId(
            doc.data().userId,
            doc.data().createdAt,
            doc.data().modifiedAt,
            doc.data().modifiedBy,
            doc.data().deletedAt,
            doc.data().deletedBy,
            doc.data().dataStatus
          );
          requesterUserEntities.push(requesterUser);
        });

        Object.assign(requestData, {
          requesterUserId: requesterUserEntities,
        });

        const providedUserId = await db
          .collection("requests")
          .doc(id)
          .collection("providedUserId")
          .get();

        providedUserId.forEach((doc) => {
          const providedUser = new ProvidedUserId(
            doc.data().userId,
            doc.data().status,
            doc.data().createdAt,
            doc.data().modifiedAt,
            doc.data().modifiedBy,
            doc.data().deletedAt,
            doc.data().deletedBy,
            doc.data().dataStatus
          );
          providedUserEntities.push(providedUser);
        });
        Object.assign(requestData, {
          providedUserId: providedUserEntities,
        });

        entities.push(requestData);
      })
    );
    res.status(200).send(entities);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getCommunityProvide = async (req, res, next) => {
  try {
    const provide = db.collection("provides");
    const allCommunityProvide = await provide
      .where("communityId", "==", req.params.id)
      .get();
    const entities = [];

    if (provide.empty) {
      res.status(404).send("No user found");
    } else {
      await Promise.all(
        allCommunityProvide.docs.map(async (doc) => {
          const id = doc.id;
          const provideData = new Provide(
            doc.id,
            doc.data().title,
            doc.data().location,
            doc.data().imageUrl,
            doc.data().description,
            doc.data().serviceCharge,
            doc.data().payment,
            doc.data().userId,
            doc.data().communityId,
            doc.data().category,
            doc.data().hashtag
          );

          let requesterUserEntities = [];

          const requesterUserId = await db
            .collection("provides")
            .doc(id)
            .collection("requesterUserId")
            .get();

          requesterUserId.forEach((doc) => {
            const requesterUser = new RequesterUserId(
              doc.data().userId,
              doc.data().status,
              doc.data().createdAt,
              doc.data().modifiedAt,
              doc.data().modifiedBy,
              doc.data().deletedAt,
              doc.data().deletedBy,
              doc.data().dataStatus
            );
            requesterUserEntities.push(requesterUser);
          });

          Object.assign(provideData, {
            requesterUserId: requesterUserEntities,
          });

          entities.push(provideData);
        })
      );
    }
    res.status(200).send(entities);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addCommunity = async (req, res, next) => {
  try {
    const data = await db.collection("communities").add({
      communityCode: req.body.communityCode,
      communityName: req.body.communityName,
      imageUrl: req.body.imageUrl,
      location: req.body.location,
      description: req.body.description,
      createAt: moment().toISOString(),
      createdBy: req.body.userId,
      modifiedAt: moment().toISOString(),
      modifiedBy: req.body.userId,
      deletedAt: req.body.deletedAt,
      deletedBy: req.body.deletedBy,
      dataStatus: 0,
    });

    if (data) {
      await db
        .collection("communities")
        .doc(data.id)
        .collection("members")
        .add({
          userId: req.body.member,
          role: 1,
          createAt: moment().toISOString(),
          createdBy: req.body.userId,
          modifiedAt: moment().toISOString(),
          modifiedBy: req.body.userId,
          deletedAt: req.body.deletedAt,
          deletedBy: req.body.deletedBy,
          dataStatus: req.body.dataStatus,
        });

      await db
        .collection("communities")
        .doc(data.id)
        .collection("joinedRequestUserId")
        .add({
          userId: req.body.joinedRequestUserId,
          status: "pending",
          createAt: moment().toISOString(),
          createdBy: req.body.userId,
          modifiedAt: moment().toISOString(),
          modifiedBy: req.body.userId,
          deletedAt: req.body.deletedAt,
          deletedBy: req.body.deletedBy,
          dataStatus: req.body.dataStatus,
        });
    }

    res.status(200).send("Community Created!");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addMember = async (req, res, next) => {
  try {
    await db
      .collection("communities")
      .doc(req.params.id)
      .collection("member")
      .add({
        userId: req.body.userId,
        role: 0,
        createAt: moment().toISOString(),
        createdBy: req.body.userId,
        modifiedAt: moment().toISOString(),
        modifiedBy: req.body.userId,
        deletedAt: req.body.deletedAt,
        deletedBy: req.body.deletedBy,
        dataStatus: 0,
      });

    res.status(200).send("add member successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateMemberStatus = async (req, res, next) => {
  try {
    await db
      .collection("communities")
      .doc(req.params.communityId)
      .collection("member")
      .doc(req.params.memberId)
      .update({
        role: req.body.role,
        modifiedAt: moment().toISOString(),
        modifiedBy: req.body.userId,
      });

    res.status(200).send("updated member successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const bannedMember = async (req, res, next) => {
  try {
    await db
      .collection("communities")
      .doc(req.params.communityId)
      .collection("member")
      .doc(req.params.memberId)
      .update({
        modifiedAt: moment().toISOString(),
        modifiedBy: req.body.userId,
        dataStatus: 1,
      });

    res.status(200).send("banned member successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const joinedCommunityRequest = async (req, res, next) => {
  try {
    const data = db.collection("communities");
    const selectedData = await data
      .where("communityName", "==", req.body.communityName)
      .where("communityCode", "==", req.body.communityCode)
      .get();

    await data
      .doc(selectedData.docs[0].id)
      .collection("joinedRequestUserId")
      .add({
        userId: req.body.userId,
        status: "pending",
        createAt: moment().toISOString(),
        createdBy: req.body.userId,
        modifiedAt: moment().toISOString(),
        modifiedBy: req.body.userId,
        dataStatus: 0,
      });

    res.status(200).send("pending to joined successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateJoinedCommunityRequest = async (req, res, next) => {
  try {
    await db
      .collection("communities")
      .doc(req.params.id)
      .collection("joinedRequestUserId")
      .doc(req.params.requestid)
      .update({
        status: req.body.status,
        modifiedAt: moment().toISOString(),
        modifiedBy: req.body.userId,
      });

    res.status(200).send("join request updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateCommunity = async (req, res, next) => {
  try {
    const document = db.collection("communities").doc(req.params.id);
    await document.update({
      ...req.body,
      modifiedAt: moment().toISOString(),
      modifiedBy: req.body.userId,
    });
    res.send("community updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteCommunity = async (req, res, next) => {
  try {
    const document = db.collection("communities").doc(req.params.id);
    await document.update({
      deletedAt: moment().toISOString(),
      deletedBy: req.body.userId,
      dataStatus: 1,
    });
    res.status(200).send("this community has deleted");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getCommunities,
  getCommunity,
  addCommunity,
  joinedCommunityRequest,
  addMember,
  updateJoinedCommunityRequest,
  updateCommunity,
  deleteCommunity,
  updateMemberStatus,
  bannedMember,
  getCommunityRequest,
  getCommunityProvide,
};
