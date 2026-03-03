import sharp from "sharp";
import fs from "fs";

export const opt = async (req, res, next) => {
    if (req.file !== undefined) {
        const nameFile = req.file.filename.split(".");
        nameFile.pop();

        await sharp(req.file.path)
            .resize(800)
            .webp()
            .toFile(req.file.destination + "\\\\Compresed_" + nameFile + ".webp", (err, info) => {
                if (err) throw err;
                //Supprime les images non compresse
                fs.unlinkSync(req.file.path);
            });

        req.file.filename = "Compresed_" + nameFile + ".webp";
    }
    next();
};
