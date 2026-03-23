import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User.js";

const MSG_ERREUR_500 = "Erreur interne du serveur";

const MSG_ERREUR_400 = "Parametre invalide";

const MSG_ERREUR_403 = "Accès interdit";

const MSG_ERREUR_404 = "Ressource inexistante";

const MSG_SUCCES_201 = "Ressource créée avec succès";
/**
 * Créer un utilisateur et stocke le mot de passe en has dans la basse de donnée
 * @param {*} req
 * @param {*} res
 */
export const signup = async (req, res) => {
    try {
        if (req.body.password === undefined || req.body.email === undefined) {
            res.status(400).json({ message: MSG_ERREUR_400 });
        }

        const hash = await bcrypt.hash(req.body.password, 10);

        await new User({
            email: req.body.email,
            password: hash,
        }).save();
        res.status(201).json({ message: "Utilisateur crée" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MSG_ERREUR_500 });
    }
};

/**
 * Permet a un utilisteur de se connecter ven créant un JWT
 * @param {*} req
 * @param {*} res
 */

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user === null) {
            res.status(400).json({ message: MSG_ERREUR_400 });
        }

        // Compare les mot de passe entre celui dans la base de donnée (deja hash) et celui dans la requete (non hash)
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            res.status(400).json({ message: MSG_ERREUR_400 });
        }

        res.status(200).json({
            userId: user._id,
            // Signe un token JWT avec l'ID de l'utilisateur en payload qui expire dans 24h
            token: jsonwebtoken.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: "24h",
            }),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MSG_ERREUR_500 });
    }
};
