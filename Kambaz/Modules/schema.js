// Kambaz/Modules/schema.js
import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
    {
        _id: String,
        name: String,
        description: String,
        // optional: keep module id if you like
        module: String,
    },
    { _id: false } // we provide _id manually
);

const moduleSchema = new mongoose.Schema(
    {
        _id: String,
        name: String,
        description: String,
        course: String, // <– course id like "CS1234"
        lessons: [lessonSchema],
    },
    { collection: "modules" } // <– use your existing collection
);

export default moduleSchema;
