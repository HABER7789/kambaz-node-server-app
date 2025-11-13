import express from "express";
import cors from "cors";
import session from "express-session";

import Lab5Routes from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
import db from "./Kambaz/Database/index.js";

const app = express();

// 👇 will be localhost:3000 in dev, Vercel URL in production
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
// 👇 use env in Render, fallback locally
const SESSION_SECRET = process.env.SESSION_SECRET || "any string";
const PORT = process.env.PORT || 4000;

app.use(
    cors({
        credentials: true,
        origin: CLIENT_URL,
    })
);

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(express.json());

UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);
Lab5Routes(app, db);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
