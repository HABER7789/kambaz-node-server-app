// Kambaz/Enrollments/dao.js
import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
    function enrollUserInCourse(userId, courseId) {
        const { enrollments } = db;

        // avoid duplicate enrollments
        const existing = enrollments.find(
            (e) => e.user === userId && e.course === courseId
        );
        if (existing) {
            return existing;
        }

        const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
        enrollments.push(newEnrollment);
        return newEnrollment;
    }

    function unenrollUserFromCourse(userId, courseId) {
        const { enrollments } = db;
        const before = enrollments.length;
        db.enrollments = enrollments.filter(
            (e) => !(e.user === userId && e.course === courseId)
        );
        return { deletedCount: before - db.enrollments.length };
    }

    // All user objects enrolled in a course
    function findUsersForCourse(courseId) {
        const { enrollments, users } = db;
        const courseEnrollments = enrollments.filter(
            (e) => e.course === courseId
        );
        const userIds = new Set(courseEnrollments.map((e) => e.user));
        return users.filter((u) => userIds.has(u._id));
    }

    return {
        enrollUserInCourse,
        unenrollUserFromCourse,
        findUsersForCourse,
    };
}
