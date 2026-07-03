import multer from "multer";

// Dictionnaire pour associer les types MIME aux extensions de fichiers
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

// Configuration du stockage des fichiers avec multer
const storage = multer.diskStorage({

    // Définit le dossier de destination des fichiers uploadés
    destination: (req, file, callback) => {
        callback(null, "images");
    },

    // Définit le nom du fichier enregistré
    filename: (req, file, callback) => {

        // Récupère le nom du fichier sans extension
        let filename = file.originalname.split(".");
        filename.pop();
        filename = filename.join("_"); 

        // Récupère l'extension en fonction du type MIME
        const extension = MIME_TYPES[file.mimetype];

        // Génère un nom unique avec timestamp
        callback(null, filename + Date.now() + "." + extension);
    },
});

// Exporte le middleware multer configuré pour gérer un seul fichier nommé "image"
export default multer({
    storage: storage,
}).single("image");
