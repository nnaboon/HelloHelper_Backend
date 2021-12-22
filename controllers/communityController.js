const db = require("../db");
const { Community, Member, JoinedRequest } = require("../models/community");

// const getCommunitites = async (req, res, next) => {
//   try {
//     const data = await db.collection("communities").get();

//     const entities = [];
//     const memberEntities = [];
//     const joinedRequestEntities = [];

//     if (data.empty) {
//       res.status(404).send("No user found");
//     } else {
//       data.forEach((doc) => {
//         const id = doc.id;
//         const user = new Community(
//           id,
//           doc.data().communityCode,
//           doc.data().communityName,
//           doc.data().imageUrl,
//           doc.data().location,
//           doc.data().description,
//           doc.data().imageUrl,
//           doc.data().createdBy,
//           doc.data().createdAt,
//           doc.data().modifiedAt,
//           doc.data().modifiedBy,
//           doc.data().deletedAt,
//           doc.data().deletedBy,
//           doc.data().dataStatus
//         );
//         const members = db
//           .collection("communities")
//           .doc(id)
//           .collection("member")
//           .get();

//         const joinedRequest = db
//           .collection("communities")
//           .doc(id)
//           .collection("joinedRequestUserId")
//           .get();
//         if (members.empty) {
//           res.status(404).send("No user found");
//         } else {
//           members.forEach((doc) => {
//             const member = new Member(
//               doc.id,
//               doc.data().status,
//               doc.data().role,
//               doc.data().requestSum,
//               doc.data().provideSum,
//               doc.data().joinedAt,
//               doc.data().leavedAt
//             );
//             memberEntities.push(member);
//           });
//           Object.assign(user, { member: memberEntities });
//         }

//         if (joinedRequest.empty) {
//           res.status(404).send("No user found");
//         } else {
//           joinedRequest.forEach((doc) => {
//             const joinedRequest = new JoinedRequest(
//               doc.id,
//               doc.data().status,
//               doc.data().role,
//               doc.data().createdBy,
//               doc.data().createdAt,
//               doc.data().modifiedAt,
//               doc.data().modifiedBy,
//               doc.data().deletedAt,
//               doc.data().deletedBy,
//               doc.data().dataStatus
//             );
//             joinedRequestEntities.push(joinedRequest);
//           });
//           Object.assign(user, {
//             joinedRequestUserId: joinedRequestEntities,
//           });
//         }
//         entities.push(user);
//       });
//     }
//     res.status(200).send(entities);
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// };

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

const addCommunity = async (req, res, next) => {
  try {
    const data = await db.collection("communities").add({
      communityCode: req.body.communityCode,
      communityName: req.body.communityName,
      imageUrl: req.body.imageUrl,
      location: req.body.location,
      description: req.body.description,
      createdAt: req.body.createdAt,
      createdBy: req.body.createdBy,
      modifiedAt: req.body.modifiedAt,
      modifiedBy: req.body.modifiedBy,
      deletedAt: req.body.deletedAt,
      deletedBy: req.body.deletedBy,
      dataStatus: req.body.dataStatus,
    });

    if (data) {
      await db
        .collection("communities")
        .doc(data.id)
        .collection("members")
        .add({
          userId: req.body.member,
          role: 1,
          createdBy: req.body.createdBy,
          modifiedAt: req.body.modifiedAt,
          modifiedBy: req.body.modifiedBy,
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
          createdBy: req.body.createdBy,
          modifiedAt: req.body.modifiedAt,
          modifiedBy: req.body.modifiedBy,
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
      .collection("members")
      .add({
        userId: req.body.member,
        role: 0,
        createdBy: req.body.createdBy,
        modifiedAt: req.body.modifiedAt,
        modifiedBy: req.body.modifiedBy,
        deletedAt: req.body.deletedAt,
        deletedBy: req.body.deletedBy,
        dataStatus: 0,
      });

    res.status(200).send("added member successfully");
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
        dataStatus: 1,
      });

    res.status(200).send("banned member successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const joinedCommunityRequest = async (req, res, next) => {
  try {
    await db
      .collection("communities")
      .doc(req.params.id)
      .collection("joinedRequestUserId")
      .add({
        userId: req.body.joinedRequestUserId,
        status: "pending",
        createdAt: req.body.createdAt,
        createdBy: req.body.createdBy,
        modifiedAt: req.body.modifiedAt,
        modifiedBy: req.body.modifiedBy,
        deletedAt: req.body.deletedAt,
        deletedBy: req.body.deletedBy,
        dataStatus: req.body.dataStatus,
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
        modifiedAt: req.body.modifiedAt,
        modifiedBy: req.body.modifiedBy,
      });

    res.status(200).send("join request updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateCommunity = async (req, res, next) => {
  try {
    const document = db.collection("communities").doc(req.params.id);
    await document.update(req.body);
    res.send("community updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteCommunity = async (req, res, next) => {
  try {
    const document = db.collection("communities").doc(req.params.id);
    await document.update({
      dataStatus: 1,
    });
    res.status(200).send("this community has deleted");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  // getCommunitites,
  getCommunity,
  addCommunity,
  joinedCommunityRequest,
  addMember,
  updateJoinedCommunityRequest,
  updateCommunity,
  deleteCommunity,
  updateMemberStatus,
  bannedMember,
};
