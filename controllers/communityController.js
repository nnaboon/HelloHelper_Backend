const db = require("../db");
const moment = require("moment");
const User = require("../models/user");
const { Provide, RequesterUserId } = require("../models/provide");
const { Request, ProvidedUserId } = require("../models/request");
const { Community, Member, JoinedRequest } = require("../models/community");
const fs = require("fs");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

const storage = admin.storage();
const bucket = storage.bucket();

let fields = {};
const BusBoy = require("busboy");
const path = require("path");
const os = require("os");

const getCommunities = async (req, res, next) => {
  try {
    const data = await db.collection("communities").orderBy("createdAt").get();

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
            // doc.data().createdAt,
            // doc.data().createdBy,
            // doc.data().modifiedAt,
            // doc.data().modifiedBy,
            // doc.data().deletedAt,
            // doc.data().deletedBy,
            doc.data().dataStatus
          );

          const memberEntities = [];
          const joinedRequestEntities = [];

          const members = await db
            .collection("communities")
            .doc(id)
            .collection("members")
            .get();

          if (members.empty) {
            Object.assign(user, { member: memberEntities });
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
            Object.assign(user, {
              joinedRequestUserId: joinedRequestEntities,
            });
          } else {
            joinedRequest.forEach((doc) => {
              const joinedRequest = new JoinedRequest(
                doc.id,
                doc.data().userId,
                doc.data().status
                // doc.data().createdAt,
                // doc.data().createdBy,
                // doc.data().modifiedAt,
                // doc.data().modifiedBy,
                // doc.data().deletedAt,
                // doc.data().deletedBy,
                // doc.data().dataStatus
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
      res.status(200).send(entities);
    }
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
      .collection("members")
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
      res.status(404).send("No community found");
    } else {
      entities.push({ communityId: id, ...data.data() });

      if (members.empty) {
        Object.assign(...entities, { member: [] });
      } else {
        await Promise.all(
          members.docs.map(async (doc) => {
            const memberUser = await db
              .collection("users")
              .doc(doc.data().userId)
              .get();
            const member = new Member(
              doc.id,
              doc.data().userId,
              doc.data().status,
              doc.data().role,
              doc.data().requestSum,
              doc.data().provideSum,
              doc.data().joinedAt,
              doc.data().leavedAt
            );
            memberEntities.push({
              ...member,
              username: memberUser.data().username,
              imageUrl: memberUser.data().imageUrl,
            });
          })
        );
        Object.assign(...entities, { member: memberEntities });
      }

      if (joinedRequest.empty) {
        Object.assign(...entities, {
          joinedRequestUserId: [],
        });
      } else {
        await Promise.all(
          joinedRequest.docs.map(async (doc) => {
            const joinedRequestUser = await db
              .collection("users")
              .doc(doc.data().userId)
              .get();
            const joinedRequest = new JoinedRequest(
              doc.id,
              doc.data().userId,
              doc.data().status
            );
            joinedRequestEntities.push({
              ...joinedRequest,
              imageUrl: joinedRequestUser.data().imageUrl,
              username: joinedRequestUser.data().username,
            });
          })
        );
        Object.assign(...entities, {
          joinedRequestUserId: joinedRequestEntities,
        });
      }
      res.status(200).send(...entities);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getMyCommunity = async (req, res, next) => {
  try {
    const user = await db.collection("users").doc(req.params.userId).get();

    const data = await db
      .collection("communities")
      .where(
        admin.firestore.FieldPath.documentId(),
        "in",
        user.data().communityId
      )
      .get();
    // const id = data.id;

    // const members = await db
    //   .collection("communities")
    //   .doc(req.params.id)
    //   .collection("members")
    //   .get();
    // const joinedRequest = await db
    //   .collection("communities")
    //   .doc(req.params.id)
    //   .collection("joinedRequestUserId")
    //   .get();

    const entities = [];

    // const memberEntities = [];
    // const joinedRequestEntities = []

    if (data.empty) {
      res.status(404).send(entities);
    } else {
      data.docs.map((doc) => {
        entities.push({ communityId: doc.id, ...doc.data() });
      });
      res.status(200).send(entities);
    }

    //   if (members.empty) {
    //     Object.assign(...entities, { member: [] });
    //   } else {
    //     members.forEach((doc) => {
    //       const member = new Member(
    //         doc.id,
    //         doc.data().status,
    //         doc.data().role,
    //         doc.data().requestSum,
    //         doc.data().provideSum,
    //         doc.data().joinedAt,
    //         doc.data().leavedAt
    //       );
    //     memberEntities.push(member);
    //   });
    //   Object.assign(...entities, { member: memberEntities });
    // }

    // if (joinedRequest.empty) {
    //   Object.assign(...entities, {
    //     joinedRequestUserId: [],
    //   });
    // } else {
    //   joinedRequest.forEach((doc) => {
    //     const joinedRequest = new JoinedRequest(
    //       doc.id,
    //       doc.data().userId,
    //       doc.data().status
    //     );
    //     joinedRequestEntities.push(joinedRequest);
    //   });
    //   Object.assign(...entities, {
    //     joinedRequestUserId: joinedRequestEntities,
    //   });
    // }
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
        const user = await db.collection("users").doc(doc.data().userId).get();
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
            new Date(doc.data().createdAt._seconds * 1000).toUTCString(),
            doc.data().createdBy,
            new Date(doc.data().modifiedAt._seconds * 1000).toUTCString(),
            doc.data().modifiedBy,
            doc.data().deletedAt,
            doc.data().deletedBy,
            doc.data().dataStatus
          );
          requesterUserEntities.push(requesterUser);
        });

        Object.assign(requestData, {
          requesterUserId: requesterUserEntities,
          user: {
            imageUrl: user.data().imageUrl,
            recommend: user.data().recommend,
            rank: user.data().rank,
            username: user.data().username,
            email: user.data().email,
            rating: user.data().rating,
          },
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
            new Date(doc.data().createdAt._seconds * 1000).toUTCString(),
            doc.data().createdBy,
            new Date(doc.data().modifiedAt._seconds * 1000).toUTCString(),
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
          const user = await db
            .collection("users")
            .doc(doc.data().userId)
            .get();
          const provideData = new Provide(
            doc.id,
            doc.data().title,
            doc.data().location,
            doc.data().imageUrl,
            doc.data().description,
            doc.data().provideSum,
            doc.data().rating,
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
              new Date(doc.data().createdAt._seconds * 1000).toUTCString(),
              new Date(doc.data().modifiedAt._seconds * 1000).toUTCString(),

              doc.data().modifiedBy,
              doc.data().deletedAt,
              doc.data().deletedBy,
              doc.data().dataStatus
            );
            requesterUserEntities.push(requesterUser);
          });

          Object.assign(provideData, {
            requesterUserId: requesterUserEntities,
            user: {
              imageUrl: user.data().imageUrl,
              recommend: user.data().recommend,
              rank: user.data().rank,
              username: user.data().username,
              email: user.data().email,
              rating: user.data().rating,
            },
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
    const isExistData = await db
      .collection("communities")
      .where("communityName", "==", req.body.communityName)
      .get();

    if (isExistData.size > 0) {
      return res.status(400).send("This community name is already taken.");
    }

    const data = await db.collection("communities").add({
      communityCode: req.body.communityCode,
      communityName: req.body.communityName,
      imageUrl: req.body.imageUrl,
      location: req.body.location,
      description: req.body.description,
      createdAt: admin.firestore.Timestamp.now(),
      createdBy: req.body.userId,
      dataStatus: 0,
    });

    if (data) {
      await db
        .collection("communities")
        .doc(data.id)
        .collection("members")
        .add({
          userId: req.body.userId,
          role: 1,
          status: 0,
          createdAt: admin.firestore.Timestamp.now(),
          createdBy: req.body.userId,
          dataStatus: 0,
        });

      await db
        .collection("users")
        .doc(req.body.userId)
        .update({
          communityId: admin.firestore.FieldValue.arrayUnion(data.id),
        });
    }
    res.status(200).send(data.id);
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
        userId: req.body.requesterUserId,
        role: 0,
        status: 0,
        createdAt: admin.firestore.Timestamp.now(),
        createdBy: req.body.communityAdminUserId,
        dataStatus: 0,
      });

    res.status(200).send("add member successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateMemberRole = async (req, res, next) => {
  try {
    const data = db.collection("communities");
    const admin = await data
      .doc(req.params.communityId)
      .collection("members")
      .where("role", "==", 1)
      .get();

    const member = await data
      .doc(req.params.communityId)
      .collection("members")
      .doc(req.params.memberId)
      .get();

    if (admin.size >= 3 && req.body.role == 1) {
      res.status(404).send("Sorry maximum admin role is 3");
    } else if (
      admin.size == 1 &&
      req.body.role == 0 &&
      member.data().role == 1
    ) {
      res.status(404).send("Sorry admin role must be at less 1");
    } else {
      await db
        .collection("communities")
        .doc(req.params.communityId)
        .collection("members")
        .doc(req.params.memberId)
        .update({
          role: req.body.role,
          modifiedAt: admin.firestore.Timestamp.now(),
          modifiedBy: req.body.communityAdminUserId,
        });
    }
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
      .collection("members")
      .doc(req.params.memberId)
      .update({
        status: 1,
        deletedAt: admin.firestore.Timestamp.now(),
        deletedBy: req.body.communityAdminUserId,
        dataStatus: 1,
      });

    res.status(200).send("banned member successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addJoinedCommunityRequest = async (req, res, next) => {
  try {
    let idToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      console.log('Found "Authorization" header');
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split("Bearer ")[1];
    } else {
      console.log('Found "__session" cookie');
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    }

    admin
      .auth()
      .verifyIdToken(idToken)
      .then(async (decodedIdToken) => {
        const data = db.collection("communities");
        const user = await db.collection("users").doc(decodedIdToken.uid).get();

        const joinedRequest = await data
          .doc(req.body.communityId)
          .collection("joinedRequestUserId")
          .add({
            userId: req.body.userId,
            status: "pending",
            createdAt: admin.firestore.Timestamp.now(),
            createdBy: decodedIdToken,
            dataStatus: 0,
          });

        let authData = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "srisawasdina@gmail.com",
            pass: "na21122542",
          },
        });

        await authData.sendMail({
          from: "Hello Helper<accounts@franciscoinoque.tech>",
          to: user.data().email,
          subject: "มีผู้ต้องการเข้่าร่วมชุมชนความข่วยเหลือ",
          html: `สวัสดี<br /><br />มีผู้ต้องการขอเข้าร่วมชุมชนความช่วยเหลือ <br /><br />ลองเช็คดูที่ได้ <a href="#">ที่นี่</a>`,
        });

        res.status(200).send(joinedRequest.id);
      })
      .catch((error) => {
        console.error("Error while verifying Firebase ID token:", error);
        res.status(403).send("Unauthorized");
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateJoinedCommunityRequest = async (req, res, next) => {
  try {
    let idToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      console.log('Found "Authorization" header');
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split("Bearer ")[1];
    } else {
      console.log('Found "__session" cookie');
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    }

    admin
      .auth()
      .verifyIdToken(idToken)
      .then(async (decodedIdToken) => {
        await db
          .collection("communities")
          .doc(req.params.id)
          .collection("joinedRequestUserId")
          .doc(req.body.joinedRequestId)
          .delete();

        if (Boolean(req.body.status)) {
          const newMember = await db
            .collection("communities")
            .doc(req.params.id)
            .collection("members")
            .add({
              userId: req.body.requesterUserId,
              role: 0,
              status: 0,
              createdAt: admin.firestore.Timestamp.now(),
              createdBy: decodedIdToken.uid,
              dataStatus: 0,
            });

          await db
            .collection("users")
            .doc(req.body.requesterUserId)
            .update({
              communityId: admin.firestore.FieldValue.arrayUnion(req.params.id),
            });
          res.status(200).send(newMember.id);
        } else {
          res.status(200).send("join request updated successfully");
        }
      })
      .catch((error) => {
        console.error("Error while verifying Firebase ID token:", error);
        res.status(403).send("Unauthorized");
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateCommunity = async (req, res, next) => {
  try {
    const document = db.collection("communities").doc(req.params.id);

    let idToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      console.log('Found "Authorization" header');
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split("Bearer ")[1];
    } else {
      console.log('Found "__session" cookie');
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    }

    admin
      .auth()
      .verifyIdToken(idToken)
      .then(async (decodedIdToken) => {
        await document.update({
          ...req.body,
          modifiedAt: admin.firestore.Timestamp.now(),
          modifiedBy: decodedIdToken.uid,
        });
        res.send("community updated successfully");
      })
      .catch((error) => {
        console.error("Error while verifying Firebase ID token:", error);
        res.status(403).send("Unauthorized");
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteCommunity = async (req, res, next) => {
  try {
    const document = db.collection("communities").doc(req.params.id);

    let idToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      console.log('Found "Authorization" header');
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split("Bearer ")[1];
    } else {
      console.log('Found "__session" cookie');
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    }

    admin
      .auth()
      .verifyIdToken(idToken)
      .then(async (decodedIdToken) => {
        await document.update({
          deletedAt: admin.firestore.Timestamp.now(),
          deletedBy: decodedIdToken.uid,
          dataStatus: 1,
        });
        res.status(200).send("deleted community successfully");
      })
      .catch((error) => {
        console.error("Error while verifying Firebase ID token:", error);
        res.status(403).send("Unauthorized");
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const uploadImage = async (req, res, next) => {
  // const folder = "communities";
  // const fileName = `${folder}/${Date.now()}`;
  // const fileUpload = bucket.file(fileName);
  // const blobStream = fileUpload.createWriteStream({
  //   metadata: {
  //     contentType: "image/jpeg",
  //   },
  // });

  // blobStream.on("error", (err) => {
  //   res.status(405).json(err);
  // });

  // blobStream.on("finish", () => {
  //   // console.log(res);
  //   bucket
  //     .file(fileName)
  //     .getSignedUrl({
  //       action: "read",
  //       expires: "03-09-2491",
  //     })
  //     .then((signedUrls) => {
  //       res.status(200).send(signedUrls[0]);
  //     });
  // });

  // blobStream.end(req.file.buffer);

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName = {};
  let imagesToUpload = [];
  let imageToAdd = {};
  let imageUrls = [];

  busboy.on("field", (fieldname, fieldvalue) => {
    fields[fieldname] = fieldvalue;
  });

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted!" });
    }

    // Getting extension of any image
    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    // Setting filename
    imageFileName = `${Math.round(
      Math.random() * 1000000000
    )}.${imageExtension}`;

    // Creating path
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToAdd = {
      imageFileName,
      filepath,
      mimetype,
    };

    file.pipe(fs.createWriteStream(filepath));
    //Add the image to the array
    imagesToUpload.push(imageToAdd);
  });

  busboy.on("finish", async () => {
    let promises = [];

    imagesToUpload.forEach((imageToBeUploaded) => {
      imageUrls.push(
        `https://firebasestorage.googleapis.com/v0/b/senior-project-97cfa.appspot.com/o/${imageToBeUploaded.imageFileName}?alt=media`
      );
      promises.push(
        admin
          .storage()
          .bucket()
          .upload(`${imageToBeUploaded.filepath}`, {
            destination: `communities/${imageFileName}`,
            resumable: false,
            metadata: {
              metadata: {
                contentType: imageToBeUploaded.mimetype,
              },
            },
          })
      );
    });

    try {
      await Promise.all(promises).then(() => {
        bucket
          .file(`communities/${imageFileName}`)
          .getSignedUrl({
            action: "read",
            expires: "03-09-2491",
          })
          .then((signedUrls) => {
            res.status(200).send(signedUrls[0]);
          });
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  busboy.end(req.rawBody);
};

const getImage = async (req, res, next) => {
  const file = bucket.file(`communities/${req.params.id}`);
  file.download().then((downloadResponse) => {
    res.status(200).send(downloadResponse[0]);
  });
};

const getCommunityMember = async (req, res, next) => {
  try {
    const entities = [];
    const data = await db
      .collection("users")
      .where("communityId", "array-contains", req.params.id)
      .get();

    if (data.empty) {
      res.status(200).send(entities);
    } else {
      await Promise.all(
        data.docs.map(async (doc) => {
          const community = await db
            .collection("communities")
            .doc(req.params.id)
            .collection("members")
            .where("userId", "==", doc.id)
            .get();

          const user = new User(
            doc.id,
            doc.data().loginType,
            doc.data().username,
            doc.data().email,
            doc.data().verifiedEmailStatus,
            doc.data().location,
            doc.data().imageUrl,
            doc.data().address,
            doc.data().phoneNumber,
            doc.data().recommend,
            doc.data().rank,
            doc.data().rating,
            doc.data().communityId,
            doc.data().category,
            doc.data().requestSum,
            doc.data().provideSum,
            doc.data().followerUserId,
            doc.data().followingUserId,
            doc.data().provideId,
            doc.data().requestId
          );
          entities.push(
            Object.assign(user, { role: community.docs[0].data().role })
          );
        })
      );
      res.status(200).send(entities);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getCommunityJoinedRequest = async (req, res, next) => {
  try {
    const requestUserId = await db
      .collection("communities")
      .doc(req.params.id)
      .collection("joinedRequestUserId")
      .get();

    // const data = await db
    //   .collection("users")
    //   .where("createdBy", "in", requestUserId.data().joinedRequestUserId)
    //   .get();

    const entities = [];

    if (requestUserId.empty) {
      res.status(200).send(entities);
    } else {
      await Promise.all(
        requestUserId.docs.map(async (requesterId) => {
          const data = await db
            .collection("users")
            .where("createdBy", "==", requesterId.data().userId)
            .get();

          data.docs.map(async (doc) => {
            const user = new User(
              doc.id,
              doc.data().loginType,
              doc.data().username,
              doc.data().email,
              doc.data().verifiedEmailStatus,
              doc.data().location,
              doc.data().imageUrl,
              doc.data().address,
              doc.data().phoneNumber,
              doc.data().recommend,
              doc.data().rank,
              doc.data().rating,
              doc.data().communityId,
              doc.data().category,
              doc.data().requestSum,
              doc.data().provideSum,
              doc.data().followerUserId,
              doc.data().followingUserId,
              doc.data().provideId,
              doc.data().requestId
            );
            entities.push(
              Object.assign(user, {
                status: requesterId.data().status,
                joinedRequestId: requesterId.id,
              })
            );
          });
        })
      );
      res.status(200).send(entities);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getCommunities,
  getCommunity,
  getCommunityMember,
  getMyCommunity,
  addCommunity,
  getCommunityJoinedRequest,
  addJoinedCommunityRequest,
  addMember,
  updateJoinedCommunityRequest,
  updateCommunity,
  deleteCommunity,
  updateMemberRole,
  bannedMember,
  getCommunityRequest,
  getCommunityProvide,
  uploadImage,
  getImage,
};
