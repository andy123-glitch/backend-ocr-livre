import express from "express";
import mongoose from "mongoose";

import userRoutes from "./routes/user.js";
import bookRoutes from "./routes/book.js";

// Permet d'avoir le chemin jusqu'a ce dossier
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
try {
    const mongodb = await mongoose.connect("mongodb://root:example@localhost:27017/LivreAPI?authSource=admin", {
        serverSelectionTimeoutMS: 5000,
    });
    console.log("Connexion a la base de donnée reussi");

    app.use(express.json());

    app.use((req, res, next) => {
        if (req.method !== "OPTIONS") console.log(`Requete ${req.method} : ${req.url}`);
        next();
    });
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
        next();
    });

    app.use("/images", express.static(join(__dirname, "images")));

    app.use("/api/auth", userRoutes);
    app.use("/api/books", bookRoutes);
} catch (error) {
    console.log(error);
}

export default app;
