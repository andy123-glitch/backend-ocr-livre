import mongoose from "mongoose";
import mongoose_unique_validator from "mongoose-unique-validator";

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.plugin(mongoose_unique_validator);

export default mongoose.model("User", userSchema);
