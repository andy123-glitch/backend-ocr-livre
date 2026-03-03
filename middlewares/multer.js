import multer from "multer";

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        let filename = file.originalname.split(".");
        filename.pop();
        filename = filename.join("_");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, filename + Date.now() + "." + extension);
    },
});

export default multer({
    storage: storage,
}).single("image");
