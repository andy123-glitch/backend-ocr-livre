import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

import User from "../models/User.js";

export const signup = async (req, res, next) => {
    try {
        if (req.body.password === undefined || req.body.email === undefined) {
            throw new Error();
        }
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = await new User({
            email: req.body.email,
            password: hash,
        }).save();
        res.status(300).json({ message: "Utilisateur crée" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }
};

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user === null) {
            res.status(400).json({ message: "Email ou mot de passe incorrect" });
        }
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }
        res.status(200).json({
            userId: user._id,
            token: jsonwebtoken.sign(
                { userId: user._id },
                "RANDOM_TOKEN_SECRET",
                {
                    expiresIn: "24h",
                },
                secretOrPrivateKey,
            ),
        });
    } catch (error) {
        res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }
};


