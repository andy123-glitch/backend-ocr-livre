import express from "express";
import mongoose from "mongoose";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

import userRoutes from "./routes/user.js";
import bookRoutes from "./routes/book.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Now you can use __dirname normally
console.log(__dirname);

const app = express();

mongoose
    .connect("mongodb://root:example@localhost:27017/LivreAPI?authSource=admin")
    .then(() => console.log("connexion a mongoDB reussi !"))
    .catch((e) => console.log("Erreur de connexion a mongodb : " + e));

app.use(express.json());

app.use((req, res, next) => {
    if (req.method !== "OPTIONS") console.log(`Requete ${req.method} : ${req.url}`);
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

export default app;
