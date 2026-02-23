import mongoose, { Schema } from "mongoose";
const ratingSchema = mongoose.Schema({
    userId: { type: String, required: true },
    grade: { type: Number, required: true },
});
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
    averageRating: { type: Number },
});

export const Book = mongoose.model("Book", bookSchema);
export const Rating = mongoose.model("Rating", ratingSchema);
