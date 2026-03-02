import jsonwebtoken from "jsonwebtoken";

/**
 * Permet de savoir si l'utilisateur est deja authentifié
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const auth = (req, res, next) => {
    try {
        // Recuper le token d'auth 
        const token = req.headers.authorization.split(" ")[1];
        const decoderToken = jsonwebtoken.verify(token, "RANDOM_TOKEN_SECRET");
        const userId = decoderToken.userId;
        req.auth = {
            userId: userId,
        };
        next();
    } catch (error) {
        res.status(401).json({message : "Erreur d'authentification"});
    }
};
