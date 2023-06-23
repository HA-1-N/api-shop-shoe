const path = require("path");
const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "/tmp/my-uploads");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });

// const upload = multer({
//   storage: storage,
//   fileFilter: function (req, file, callback) {
//     if (file.mimetype == "image/png" || file.mimetype == "image/jpg") {
//       callback(null, true);
//     } else {
//       console.log("Only support file png or jpg !");
//       callback(null, false);
//     }
//   },
//   limits: {
//     fieldSize: 1024 * 1024 * 2,
//   },
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "images"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + getFileExtension(file.originalname)
    );
  },
});

// Define the allowed file extensions
const allowedExtensions = [".png", ".jpg", ".jpeg"];

// Create a file filter function
const fileFilter = (req, file, cb) => {
  const ext = getFileExtension(file.originalname);
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG or JPG files are allowed!"), false);
  }
};

// Helper function to get the file extension
const getFileExtension = (filename) => {
  const ext = path.extname(filename);
  return ext.toLowerCase();
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = { upload };
