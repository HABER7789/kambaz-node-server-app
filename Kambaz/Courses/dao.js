import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
    function findAllCourses() {
        return db.courses;
    }

    function findCoursesForEnrolledUser(userId) {
        const { courses, enrollments } = db;
        const enrolledCourses = courses.filter((course) =>
            enrollments.some(
                (enrollment) =>
                    enrollment.user === userId &&
                    enrollment.course === course._id
            )
        );
        return enrolledCourses;
    }

    function createCourse(course) {
        const newCourse = { ...course, _id: uuidv4() };
        db.courses = [...db.courses, newCourse];
        return newCourse;
    }

    function updateCourse(courseId, courseUpdates) {
        const { courses } = db;
        const course = courses.find((course) => course._id === courseId);
        if (!course) return null;
        Object.assign(course, courseUpdates);
        return course;
    }

    // 🔧 NEW: deleteCourse used by DELETE /api/courses/:courseId
    function deleteCourse(courseId) {
        const { courses } = db;
        const index = courses.findIndex((course) => course._id === courseId);
        if (index === -1) return { deletedCount: 0 };

        db.courses = [
            ...courses.slice(0, index),
            ...courses.slice(index + 1),
        ];
        return { deletedCount: 1 };
    }

    return {
        findAllCourses,
        findCoursesForEnrolledUser,
        createCourse,
        updateCourse,
        deleteCourse,
    };
}
