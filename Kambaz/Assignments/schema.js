// Kambaz/Assignments/schema.js
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
    {
        _id: String,          // e.g. "CS1234-A1" or uuid
        course: String,       // course _id, e.g. "CS1234"
        title: String,
        points: Number,
        due: String,          // ISO string; easier since your seed data is strings
        availableFrom: String,
        description: String,
    },
    {
        collection: "assignments",
    }
);

export default assignmentSchema;
