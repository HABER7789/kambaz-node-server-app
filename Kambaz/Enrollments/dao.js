// Kambaz/Enrollments/dao.js
import model from "./model.js";

export default function EnrollmentsDao(db) {
    // All raw enrollment docs for a user (used by /api/users/current/enrollments)
    async function findEnrollmentsForUser(userId) {
        return model.find({ user: userId });
    }

    // Courses a user is enrolled in (used for /api/users/:uid/courses)
    async function findCoursesForUser(userId) {
        const enrollments = await model
            .find({ user: userId })
            .populate("course");
        return enrollments.map((enrollment) => enrollment.course);
    }

    // All user documents enrolled in a given course (for People page)
    async function findUsersForCourse(courseId) {
        const enrollments = await model
            .find({ course: courseId })
            .populate("user");
        return enrollments.map((enrollment) => enrollment.user);
    }

    // Enroll a user in a course
    async function enrollUserInCourse(userId, courseId) {
        return model.create({
            _id: `${userId}-${courseId}`, // composite key to avoid duplicates
            user: userId,
            course: courseId,
            enrollmentDate: new Date(),
            status: "ENROLLED",
        });
    }

    // Unenroll one user from one course
    async function unenrollUserFromCourse(userId, courseId) {
        return model.deleteOne({ user: userId, course: courseId });
    }

    // Remove ALL enrollments for a course (used when deleting a course)
    async function unenrollAllUsersFromCourse(courseId) {
        return model.deleteMany({ course: courseId });
    }

    return {
        findEnrollmentsForUser,
        findCoursesForUser,
        findUsersForCourse,
        enrollUserInCourse,
        unenrollUserFromCourse,
        unenrollAllUsersFromCourse,
    };
}
