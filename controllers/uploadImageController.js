const admin = require("firebase-admin");

const storage = admin.storage();
const bucket = storage.bucket();

const uploadImage = async (req, res, next) => {
  const folder = "profile";
  const fileName = `${folder}/${Date.now()}`;
  const fileUpload = bucket.file(fileName);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  blobStream.on("error", (err) => {
    res.status(405).json(err);
  });

  blobStream.on("finish", () => {
    res.status(200).send("Upload complete!");
  });

  blobStream.end(req.file.buffer);
};

const getImage = async (req, res, next) => {
  const file = bucket.file(`profile/${req.params.id}`);
  file.download().then((downloadResponse) => {
    res.status(200).send(downloadResponse[0]);
  });
};
module.exports = { uploadImage, getImage };
