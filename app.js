const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();


mongoose
    .connect("mongodb://root:example@localhost:27017/test?authSource=admin")
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

app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
