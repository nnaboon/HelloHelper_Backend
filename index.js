const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
var serviceAccount = require("./serviceAccountKey.json");
const bodyParser = require("body-parser");
const usersRoute = require("./rotues/users");
const communityRoute = require("./rotues/community");
const requestRoute = require("./rotues/request");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore()

const app = express();

app.use(cors({ origin: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", usersRoute.routes);
app.use("/community", communityRoute.routes);
app.use("/request", requestRoute.routes);

app.listen(5000, () => console.log("App is listening on url http://localhost"));

// //Post

// app.get("/posts", async (req, res) => {
//   try {
//     const snapshot = await db.collection("posts").get();
//     const entities = [];
//     snapshot.forEach((doc) => {
//       entities.push({ id: doc.id, ...doc.data() });
//     });
//     return res.status(200).send(entities);
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// });

// app.post("/posts", async (req, res) => {
//   try {
//     await db.collection("posts").add({
//       type: req.body.type,
//       title: req.body.title,
//       location: req.body.location,
//       amount: req.body.amount,
//       price: req.body.price,
//       serviceCharge: req.body.serviceCharge,
//       payment: req.body.payment,
//       message: req.body.message,
//       category: req.body.category,
//       hashtag: req.body.hashtag,
//       userId: req.body.userId,
//       name: req.body.name,
//       rank: req.body.rank,
//       rating: req.body.rating,
//     });
//     return res.status(200).send("Post created");
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// });

// app.put("/posts/:id", async (req, res) => {
//   try {
//     const document = db.collection("posts").doc(req.params.id);
//     await document.update({
//       type: req.body.type,
//       title: req.body.title,
//       location: req.body.location,
//       amount: req.body.amount,
//       price: req.body.price,
//       serviceCharge: req.body.serviceCharge,
//       payment: req.body.payment,
//       message: req.body.message,
//       category: req.body.category,
//       hashtag: req.body.hashtag,
//       userId: req.body.userId,
//       name: req.body.name,
//       rank: req.body.rank,
//       rating: req.body.rating,
//     });

//     return res.status(200).send("Post update");
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// });

// // User

// app.get("/users", async (req, res) => {
//   try {
//     const users = await db.collection("users").get();
//     const entities = [];
//     users.forEach((doc) => {
//       entities.push({ userId: doc.id, ...doc.data() });
//     });
//     return res.status(200).send(entities);
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// });

// app.post("/users", async (req, res) => {
//   try {
//     db.collection("users").add({
//       name: req.body.name,
//       imageUrl: req.body.imageUrl,
//       location: req.body.location,
//       community: req.body.community,
//       category: req.body.category,
//       following: req.body.following,
//       follower: req.body.follower,
//       helpSum: req.body.helpSum,
//       requestSum: req.body.requestSum,
//       rating: req.body.rating,
//       rank: req.body.rank,
//       recommend: req.body.recommend,
//     });
//     res.status(200).send("User created");
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// app.get("/users/:id", async (req, res) => {
//   const getUser = await db.collection("users").doc(req.params.id).get();
//   const getUserData = getUser.id;
//   return res.status(200).send(getUserData);
// });

// app.get("/name", async (req, res) => {
//   try {
//     const user = await db.collection("users");
//     const users = await user.where("name", "==", req.body.name).get();
//     const entities = [];
//     users.forEach((doc) => {
//       entities.push(doc.data());
//     });
//     return res.status(200).send(user);
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// });

// exports.api = functions.https.onRequest(app);
