import jsonwebtoken from "jsonwebtoken";

export const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoderToken = jsonwebtoken.verify(token, "RANDOM_TOKEN_SECRET");
        const userId = decoderToken.userId;
        req.auth = {
            userId: userId,
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
