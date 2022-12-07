const multer = require("multer");

// SET STORAGE
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {},
  filename: function (req, file, cb) {},
});

/* defined filter */
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format"), false);
  }
};

const upload = multer({ fileFilter: fileFilter, storage: diskStorage });
module.exports = upload;
