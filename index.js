const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
var serviceAccount = require("./serviceAccountKey.json");

const bodyParser = require("body-parser");
const usersRoute = require("./rotues/users");
const communityRoute = require("./rotues/community");
const requestRoute = require("./rotues/request");
const provideRoute = require("./rotues/provide");
const orderRoute = require("./rotues/order");
const chatRoute = require("./rotues/chat");
const uploadImageRoute = require("./rotues/uploadImage");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore()

const app = express();

app.use(cors());

const PORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", usersRoute.routes);
app.use("/community", communityRoute.routes);
app.use("/request", requestRoute.routes);
app.use("/provide", provideRoute.routes);
app.use("/order", orderRoute.routes);
app.use("/chat", chatRoute.routes);
app.use("/image", uploadImageRoute.routes);

// app.listen(PORT, () =>
//   console.log("App is listening on url http://localhost:", PORT)
// );

exports.api = functions.region("asia-southeast1").https.onRequest(app);
