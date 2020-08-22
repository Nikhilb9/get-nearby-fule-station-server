/** @format */
/**
 * This service create for upload file to using multer
 */
const multer = require("multer");

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "uploads");
	},
	filename: (req, file, callback) => {
		callback(null, file.originalname);
	},
});

let fileFilter = function (req, file, cb) {
	var allowedMimes = ["image/jpeg", "image/pjpeg", "image/png"];
	if (allowedMimes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(
			{
				success: false,
				message: "Invalid file type. Only jpg, png image files are allowed.",
			},
			false
		);
	}
};
let obj = {
	storage: storage,
	limits: {
		fileSize: 3 * 1024 * 1024,
	},
	fileFilter: fileFilter,
};
const upload = multer(obj).single("file");
module.exports = upload;
