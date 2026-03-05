import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import userRoutes from "./routes/user.js";
import bookRoutes from "./routes/book.js";

// Permet d'avoir le chemin jusqu'a ce dossier
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
try {
    await mongoose.connect(process.env.DATABASE_URL, {
        serverSelectionTimeoutMS: 5000,
    });
        
    console.log("Connexion a la base de donnée reussi");

    /*const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
        standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
        ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    });
    app.use(limiter);
    app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));*/
    
    app.use(express.json());
    app.use((req, res, next) => {
        if (req.method !== "OPTIONS") {
            console.log(`[${req.protocol}]Requete ${req.method} : ${req.url} / `);
        }
        next();
    }); 
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
        );
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
