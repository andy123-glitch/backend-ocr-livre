import { Book, Rating } from "../models/Book.js";
import fs from "fs";

/**
 * Permet de récuperer tous les livres
 * @param {*} req
 * @param {*} res
 */
export const getBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur" });
    }
};

/**
 * Permet de récuperer un livre avec l'id passé en parametre
 * @param {*} req
 * @param {*} res
 */
export const getOneBook = async (req, res) => {
    try {
        const book = await Book.find({ _id: req.params.id }).populate("ratings").exec();
        res.status(200).json(book[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur" });
    }
};

/**
 * Permet de récuperer les 3 livres avec le plus grosse moyenne
 * @param {*} req
 * @param {*} res
 */

export const getBestRatingsBooks = async (req, res) => {
    try {
        const books = await Book.find().limit(3).sort("-averageRating").populate("ratings").exec();
        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur" });
    }
};

/**
 * Permet de créer un livre
 * @param {*} req
 * @param {*} res
 */
export const createOneBook = async (req, res) => {
    try {
        const body = JSON.parse(req.body.book);
        const rating = new Rating({
            userId: req.auth.userId,
            grade: body.ratings[0].grade,
        });
        await rating.save();
        delete body.ratings;
        delete body.userId;
        const url = `http://${req.get("host")}/${req.file.destination}/${req.file.filename}`;
        const book = new Book({
            userId: req.auth.userId,
            ...body,
            ratings: [rating._id],
            imageUrl: url,
        });
        await book.save();
        res.status(200).json({ message: "Livre crée" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur" });
    }
};

/**
 * Permet de supprimer un livre et son image associée avec l'id récupere via l'url
 * @param {*} req
 * @param {*} res
 */

export const deleteOneBook = async (req, res) => {
    try {
        const book = await Book.findById({ _id: req.params.id });
        const url = "images/" + book.imageUrl.split("/images/")[1];
        // Permet de supprimer un fichier et appele une fonction quand le fichier et supprimer ou qu'une erreur s'est produite
        await fs.unlink(url, async (err) => {
            try {
                if (err) throw err;
                await book.deleteOne();
                console.log(url, " a ete supprime");
                res.status(200).json({ message: "Livre supprimée" });
            } catch (error) {
                res.status(500).json({ message: "Erreur" });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur" });
    }
};

/**
 * Permet d'ajouter une note a un livre.
 * Vreifie que l'id du middlewere et de la requete soit identique
 * Vreifie que l'id du parametre soit un nombre, soit inferieur a 5 et supperieur a 0
 * @param {*} req
 * @param {*} res
 */
export const addRating = async (req, res) => {
    try {
        if (req.body.userId != req.auth.userId) {
            throw new Error("User id incompatible");
        }
        if (isNaN(req.body.rating)) {
            throw new Error("Rating dans body n'est pas un nombre");
        }
        if (req.body.rating >= 6 || req.body.rating <= 0) {
            throw new Error("Rating est trop grand ou petit");
        }
        const book = await Book.findById(req.params.id).populate("ratings").exec();
        const found = book.ratings.find(({ userId }) => req.auth.userId === userId);
        if (found !== undefined) {
            throw new Error("L'utilisateur a deja vote");
        }
        const rating = await new Rating({
            userId: req.auth.userId,
            grade: req.body.rating,
        }).save();
        book.ratings.push(rating);

        //Determine la moyenne du livre aprés avoir ajouté la nouvelle note
        const average = book.ratings.reduce((acc, { grade }) => acc + grade, 0) / book.ratings.length;

        // Permet de garder 1 chiffre derriere la virgule
        book.averageRating = Math.floor(average * 10) / 10;

        await book.save();
        res.status(201).json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur" });
    }
};
