import Book from "../models/Book.js";

export const getBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Erreur" });
    }
};

export const getOneBook = async (req, res) => {
    try {
        const book = await Book.find({ _id: req.params.id });
        res.status(200).json(book);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Erreur" });
    }
};

export const getBestRatingsBooks = async (req, res) => {
    try {
        const books = await Book.find({}).limit(3).sort("averageRating");
        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Erreur" });
    }
};

export const createOneBook = async (req, res) => {
    try {
        res.status(200).json({ req: "sdfsdf" });
    } catch (error) {
        res.status(400).json({ message: "Erreur" });
    }
};
