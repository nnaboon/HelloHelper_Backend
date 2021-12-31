const functions = require("firebase-functions");
const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "senior-project-97cfa.appspot.com",
});

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

module.exports = db;
