import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import userRoutes from "./routes/user.js";
import bookRoutes from "./routes/book.js";

// Permet d'avoir le chemin absolu du dossier courant (utile en ES modules)
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

try {
    // Récupération des variables d'environnement
    const db_url = process.env.DATABASE_URL;
    const jwt = process.env.JWT_SECRET;

    // Vérifie que les variables essentielles existent
    if (!db_url || !jwt) {
        throw new Error("Vous devez configurer votre fichier .env. Un exemple est présent dans le projet");
    }

    // Connexion à MongoDB avec un timeout de 5 secondes
    await mongoose.connect(process.env.DATABASE_URL, {
        serverSelectionTimeoutMS: 5000,
    });

    console.log("Connexion à la base de données réussie ✅");

    // Limiteur de requêtes pour éviter les abus (100 requêtes / 15 min / IP)
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        ipv6Subnet: 56,
    });

    app.use(limiter);

    // Sécurise les headers HTTP (protection XSS, clickjacking, etc.)
    app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

    // Permet de parser le JSON dans les requêtes
    app.use(express.json());

    // Middleware de log des requêtes (sauf OPTIONS)
    app.use((req, res, next) => {
        if (req.method !== "OPTIONS") {
            console.log(`[${req.protocol}] Requête ${req.method} : ${req.url}`);
        }
        next();
    });

    // Configuration des headers CORS (autorise toutes les origines ici)
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
        );
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, PATCH, OPTIONS"
        );
        next();
    });

    // Sert les fichiers statiques (images) depuis le dossier "images"
    app.use("/images", express.static(join(__dirname, "images")));

    // Routes d'authentification (inscription / connexion)
    app.use("/api/auth", userRoutes);

    // Routes liées aux livres
    app.use("/api/books", bookRoutes);

} catch (error) {
    // Affiche les erreurs (connexion DB, config, etc.)
    console.log(error);
}

// Export de l'app pour l'utiliser ailleurs (ex: server.js)
export default app;
