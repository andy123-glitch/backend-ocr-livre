import { Book, Rating } from "../models/Book.js";
import fs from "fs";

const MSG_ERREUR_500 = "Erreur interne du serveur";

const MSG_ERREUR_400 = "Parametre invalide";


const MSG_ERREUR_403 = "Accès interdit";

const MSG_ERREUR_404 = "Ressource inexistante";

const MSG_SUCCES_201 = "Ressource créée avec succès";

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
        res.status(500).json({ message: MSG_ERREUR_500 });
    }
};

/**
 * Permet de récuperer un livre avec l'id passé en parametre
 * @param {*} req
 * @param {*} res
 */
export const getOneBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate("ratings").exec();
        if (!book) res.status(404).json({ error: MSG_ERREUR_404 });
        res.status(200).json(book);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: MSG_ERREUR_400 });
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
        res.status(500).json({ message: MSG_ERREUR_500 });
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

        res.status(201).json({ message: MSG_SUCCES_201 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MSG_ERREUR_500 });
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
        if (book.userId !== req.auth.userId) {
            res.status(403).json({ message: MSG_ERREUR_403 });
        }
        const url = "images/" + book.imageUrl.split("/images/")[1];
        // Permet de supprimer un fichier et appele une fonction quand le fichier et supprimer ou qu'une erreur s'est produite
        await fs.unlink(url, async (err) => {
            try {
                if (err) throw err;
                await book.deleteOne();
                res.status(200).json({ message: "Livre supprime" });
            } catch (error) {
                res.status(500).json({ message: MSG_ERREUR_500 });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MSG_ERREUR_500 });
    }
};

/**
 * Mettre a jour un livre
 * @param {*} req
 * @param {*} res
 */

export const updateBook = async (req, res) => {
    try {
        const oldBook = await Book.findById({ _id: req.params.id });
        if (!oldBook) res.status(404).json({ error: MSG_ERREUR_404 });

        if (oldBook.userId !== req.auth.userId) {
            res.status(403).json({ message: MSG_ERREUR_403 });
        }

        let book = req.body;
        let image = false;
        // Verifie que l'utilisateur change l'image
        if (req.file !== undefined) {
            book = JSON.parse(req.body.book);
            image = true;
        }

        delete book.ratings;
        delete book.averageRating;
        book.userId = req.auth.userId;
        if (image) {
            // Recuper l'ancienne url de l'image pour la supprimer
            const oldUrl = "images/" + oldBook.imageUrl.split("/images/")[1];
            fs.unlinkSync(oldUrl);

            const newUrl = `http://${req.get("host")}/${req.file.destination}/${req.file.filename}`;
            book.imageUrl = newUrl;
        }

        await Book.updateOne({ _id: req.params.id }, { ...book });
        res.status(200).json({ message: "Livre modifie" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: MSG_ERREUR_500 });
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
            res.status(403).json({ message: MSG_ERREUR_403 });
        }
        if (isNaN(req.body.rating) || req.body.rating >= 6 || req.body.rating <= 0) {
            res.status(404).json({ message: MSG_ERREUR_400 });
        }
        const book = await Book.findById(req.params.id).populate("ratings").exec();
        if (!book) res.status(404).json({ error: MSG_ERREUR_404 });

        const found = book.ratings.find(({ userId }) => req.auth.userId === userId);

        if (found !== undefined) {
            res.status(403).json({ message: MSG_ERREUR_403 });
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
        res.status(500).json({ message: MSG_ERREUR_500 });
    }
};
