// Kambaz/Courses/schema.js
import mongoose from "mongoose";
import moduleSchema from "../Modules/schema.js";

const courseSchema = new mongoose.Schema(
    {
        _id: String,
        number: String,
        name: String,
        description: String,
        img: String,
        credits: Number,          // optional, fine if unused
        modules: [moduleSchema],  // <– embedded modules + lessons
    },
    { collection: "courses" }
);

export default courseSchema;
