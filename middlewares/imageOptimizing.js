import sharp from "sharp";
import fs from "fs";

// Middleware pour optimiser (compresser) une image uploadée
export const opt = async (req, res, next) => {

    // Vérifie si un fichier a bien été envoyé dans la requête
    if (req.file !== undefined) {

        // Récupère le nom du fichier sans son extension
        const nameFile = req.file.filename.split(".");
        nameFile.pop(); // supprime l'extension

        // Utilise sharp pour redimensionner et convertir l'image en format webp
        await sharp(req.file.path)
            .resize(800) // redimensionne l'image à une largeur de 800px (hauteur auto)
            .webp() // convertit l'image en format webp (plus léger)
            .toFile(
                req.file.destination + "\\\\Compresed_" + nameFile + ".webp",
                (err, info) => {
                    if (err) throw err;

                    // Supprime l'image originale non compressée
                    fs.unlinkSync(req.file.path);
                }
            );

        // Met à jour le nom du fichier dans la requête avec le nouveau fichier compressé
        req.file.filename = "Compresed_" + nameFile + ".webp";
    }

    // Passe au middleware suivant
    next();
};
