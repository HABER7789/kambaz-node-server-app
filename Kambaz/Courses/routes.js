// Kambaz/Courses/routes.js
import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
    const dao = CoursesDao(db);
    const enrollmentsDao = EnrollmentsDao(db);

    // Debug logging for /api/courses
    app.use("/api/courses", (req, res, next) => {
        console.log(`📚 [COURSES] ${req.method} ${req.originalUrl}`);
        console.log("   cookies:", req.headers.cookie || "(none)");
        console.log(
            "   session currentUser:",
            req.session?.currentUser || "(none)"
        );
        next();
    });

    // GET /api/courses – all courses
    const findAllCourses = async (req, res) => {
        const courses = await dao.findAllCourses();
        res.send(courses);
    };

    // GET /api/courses/:courseId – single course
    const findCourseById = async (req, res) => {
        const { courseId } = req.params;
        const course = await dao.findCourseById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    };

    // GET /api/users/:userId/courses – courses a user is enrolled in
    const findCoursesForEnrolledUser = async (req, res) => {
        let { userId } = req.params;

        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }

        try {
            const courses = await enrollmentsDao.findCoursesForUser(userId);
            res.json(courses);
        } catch (err) {
            console.error("findCoursesForEnrolledUser error", err);
            res.sendStatus(500);
        }
    };

    // POST /api/courses – create a course (generic)
    const createCourse = async (req, res) => {
        const newCourse = await dao.createCourse(req.body);
        res.json(newCourse);
    };

    // POST /api/users/current/courses – create course AND enroll current user
    const createCourseForCurrentUser = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.sendStatus(401);
        }

        try {
            const newCourse = await dao.createCourse(req.body);
            await enrollmentsDao.enrollUserInCourse(
                currentUser._id,
                newCourse._id
            );
            res.json(newCourse);
        } catch (err) {
            console.error("createCourseForCurrentUser error", err);
            res.sendStatus(500);
        }
    };

    // PUT /api/courses/:courseId – update
    const updateCourse = async (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = await dao.updateCourse(courseId, courseUpdates);
        res.send(status);
    };

    // DELETE /api/courses/:courseId – delete course AND its enrollments
    const deleteCourse = async (req, res) => {
        const { courseId } = req.params;
        try {
            await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
            const status = await dao.deleteCourse(courseId);
            res.send(status);
        } catch (err) {
            console.error("deleteCourse error", err);
            res.sendStatus(500);
        }
    };

    // Route bindings
    app.get("/api/courses", findAllCourses);
    app.get("/api/courses/:courseId", findCourseById);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.post("/api/courses", createCourse);
    app.post("/api/users/current/courses", createCourseForCurrentUser);
    app.put("/api/courses/:courseId", updateCourse);
    app.delete("/api/courses/:courseId", deleteCourse);
}
