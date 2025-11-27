// Kambaz/Assignments/dao.js
import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao(db) {
    // All assignments for a course
    async function findAssignmentsForCourse(courseId) {
        return model.find({ course: courseId });
    }

    // Create a new assignment
    async function createAssignment(assignment) {
        const newAssignment = {
            ...assignment,
            _id: assignment._id || uuidv4(),
        };
        const created = await model.create(newAssignment);
        return created;
    }

    // Delete by _id
    async function deleteAssignment(assignmentId) {
        const status = await model.deleteOne({ _id: assignmentId });
        return status; // { deletedCount: ... }
    }

    // Update and return the updated doc (or null if not found)
    async function updateAssignment(assignmentId, assignmentUpdates) {
        const updated = await model.findByIdAndUpdate(
            assignmentId,
            { $set: assignmentUpdates },
            { new: true } // return updated doc
        );
        return updated;
    }

    return {
        findAssignmentsForCourse,
        createAssignment,
        deleteAssignment,
        updateAssignment,
    };
}
