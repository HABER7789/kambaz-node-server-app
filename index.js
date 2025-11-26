// index.js
import express from "express";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";


import Lab5Routes from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
import db from "./Kambaz/Database/index.js";


const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz"

mongoose.connect(CONNECTION_STRING);

const app = express();

// ====== CONFIG ======
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const SESSION_SECRET = process.env.SESSION_SECRET || "any string";
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

const allowedOrigins = ["http://localhost:3000"];
if (CLIENT_URL && !allowedOrigins.includes(CLIENT_URL)) {
    allowedOrigins.push(CLIENT_URL);
}

console.log("CORS allowed origins:", allowedOrigins);
console.log("NODE_ENV:", NODE_ENV);

app.set("trust proxy", 1);

// ====== MIDDLEWARE ======
app.use(
    cors({
        credentials: true,
        origin: allowedOrigins,
    })
);

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: NODE_ENV === "production",
            sameSite: NODE_ENV === "production" ? "none" : "lax",
        },
    })
);

app.use(express.json());

// ====== ROUTES ======
UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);
Lab5Routes(app, db);

// ====== START ======
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
