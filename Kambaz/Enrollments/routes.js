// Kambaz/Enrollments/routes.js
import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
    const dao = EnrollmentsDao(db);

    // ---------- People table: list users for a course ----------
    // GET /api/courses/:courseId/people
    app.get("/api/courses/:courseId/people", async (req, res) => {
        const { courseId } = req.params;
        try {
            const users = await dao.findUsersForCourse(courseId);
            res.json(users);
        } catch (err) {
            console.error("findUsersForCourse error", err);
            res.sendStatus(500);
        }
    });

    // ---------- People table: enroll a specific user in a course ----------
    // POST /api/courses/:courseId/enrollments   { userId }
    app.post("/api/courses/:courseId/enrollments", async (req, res) => {
        const { courseId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            res.status(400).json({ message: "userId required" });
            return;
        }

        try {
            const enrollment = await dao.enrollUserInCourse(userId, courseId);
            res.json(enrollment);
        } catch (err) {
            console.error("enrollUserInCourse error", err);
            res.sendStatus(500);
        }
    });

    // ---------- People table: unenroll a specific user from a course ----------
    // DELETE /api/courses/:courseId/enrollments/:userId
    app.delete(
        "/api/courses/:courseId/enrollments/:userId",
        async (req, res) => {
            const { courseId, userId } = req.params;
            try {
                const status = await dao.unenrollUserFromCourse(
                    userId,
                    courseId
                );
                res.json(status);
            } catch (err) {
                console.error("unenrollUserFromCourse error", err);
                res.sendStatus(500);
            }
        }
    );

    // ---------- "current user" enrollments (used by ENROLLMENTS_API) ----------

    // GET /api/users/current/enrollments
    app.get("/api/users/current/enrollments", async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        try {
            const enrollments = await dao.findEnrollmentsForUser(
                currentUser._id
            );
            res.json(enrollments);
        } catch (err) {
            console.error("findEnrollmentsForUser error", err);
            res.sendStatus(500);
        }
    });

    // POST /api/users/current/enrollments/:courseId
    app.post("/api/users/current/enrollments/:courseId", async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        const { courseId } = req.params;
        try {
            const enrollment = await dao.enrollUserInCourse(
                currentUser._id,
                courseId
            );
            res.json(enrollment);
        } catch (err) {
            console.error("enroll current user error", err);
            res.sendStatus(500);
        }
    });

    // DELETE /api/users/current/enrollments/:courseId
    app.delete(
        "/api/users/current/enrollments/:courseId",
        async (req, res) => {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            const { courseId } = req.params;
            try {
                const status = await dao.unenrollUserFromCourse(
                    currentUser._id,
                    courseId
                );
                res.json(status);
            } catch (err) {
                console.error("unenroll current user error", err);
                res.sendStatus(500);
            }
        }
    );
}
