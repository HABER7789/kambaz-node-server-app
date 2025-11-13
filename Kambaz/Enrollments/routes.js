// Kambaz/Enrollments/routes.js
import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
    const dao = EnrollmentsDao(db);

    // ---------- People table: list users for a course ----------
    // GET /api/courses/:courseId/people
    app.get("/api/courses/:courseId/people", (req, res) => {
        const { courseId } = req.params;
        const users = dao.findUsersForCourse(courseId);
        res.json(users);
    });

    // ---------- People table: enroll a specific user in a course ----------
    // POST /api/courses/:courseId/enrollments   { userId }
    app.post("/api/courses/:courseId/enrollments", (req, res) => {
        const { courseId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            res.status(400).json({ message: "userId required" });
            return;
        }

        const enrollment = dao.enrollUserInCourse(userId, courseId);
        res.json(enrollment);
    });

    // ---------- People table: unenroll a specific user from a course ----------
    // DELETE /api/courses/:courseId/enrollments/:userId
    app.delete("/api/courses/:courseId/enrollments/:userId", (req, res) => {
        const { courseId, userId } = req.params;
        const status = dao.unenrollUserFromCourse(userId, courseId);
        res.json(status);
    });

    // ---------- Optional: "current user" enrollments (used by ENROLLMENTS_API) ----------

    // GET /api/users/current/enrollments
    app.get("/api/users/current/enrollments", (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { enrollments } = db;
        const my = enrollments.filter((e) => e.user === currentUser._id);
        res.json(my);
    });

    // POST /api/users/current/enrollments/:courseId
    app.post("/api/users/current/enrollments/:courseId", (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { courseId } = req.params;
        const enrollment = dao.enrollUserInCourse(currentUser._id, courseId);
        res.json(enrollment);
    });

    
    app.delete("/api/users/current/enrollments/:courseId", (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { courseId } = req.params;
        const status = dao.unenrollUserFromCourse(currentUser._id, courseId);
        res.json(status);
    });
}
