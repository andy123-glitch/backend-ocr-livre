import mongoose from "mongoose";
import mongoose_unique_validator from "mongoose-unique-validator";

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [{ userId: { type: String, required: true }, grade: { type: Number, required: true } }],
    averageRatings: { type: String, required: true },
});

export default mongoose.model("Book", bookSchema);
