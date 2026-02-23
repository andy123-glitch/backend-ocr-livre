import e from "express";
import { Book, Rating } from "../models/Book.js";

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
        const book = await Book.find({ _id: req.params.id }).populate("ratings").exec();
        console.log(req.params.id);
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
        const body = JSON.parse(req.body.book);
        const rating = new Rating({
            userId: req.auth.userId,
            grade: body.ratings[0].grade,
        });
        await rating.save();
        delete body.ratings;
        delete body.userId;
        const url = `http://${req.get("host")}/${req.file.destination}/${req.file.filename}`;
        console.log(url);
        const book = new Book({
            userId: req.auth.userId,
            ...body,
            ratings: [rating._id],
            imageUrl: url,
        });
        await book.save();
        res.status(200).json({ message: "Livre crée" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Erreur" });
    }
};

export const deleteOneBook = async (req, res) => {
    try {
        await Book.findOneAndDelete({ _id: req.params.id }).exec();
        
        res.status(200).json({ message: "Livre supprimée" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Erreur" });
    }
};
