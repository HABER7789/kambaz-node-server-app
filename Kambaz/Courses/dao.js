// Kambaz/Courses/dao.js
import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
    // Fetch all courses with everything the cards need
    const findAllCourses = () =>
        model.find({}, { name: 1, description: 1, number: 1, img: 1 });

    const findCourseById = (courseId) => model.findById(courseId);

    const createCourse = (course) => {
        const newCourse = {
            ...course,
            _id: course._id || course.number || uuidv4(),
        };
        return model.create(newCourse);
    };

    const deleteCourse = (courseId) =>
        model.deleteOne({ _id: courseId });

    const updateCourse = (courseId, courseUpdates) =>
        model.updateOne({ _id: courseId }, { $set: courseUpdates });

    return {
        findAllCourses,
        findCourseById,
        createCourse,
        deleteCourse,
        updateCourse,
    };
}
