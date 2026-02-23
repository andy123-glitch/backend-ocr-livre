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
        const filename = file.originalname.split(".").join("_");
        const name = filename.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        console.log("Nouveau fichier : ", name + Date.now() + "." + extension);
        callback(null, name + Date.now() + "." + extension);
    },
});

export default multer({
    storage: storage,
}).single("image");
