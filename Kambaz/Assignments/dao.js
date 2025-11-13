
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
    function findAssignmentsForCourse(courseId) {
        const { assignments } = db;
        return assignments.filter((a) => a.course === courseId);
    }

    function createAssignment(assignment) {
        const newAssignment = { ...assignment, _id: uuidv4() };
        db.assignments = [newAssignment, ...db.assignments];
        return newAssignment;
    }

    function deleteAssignment(assignmentId) {
        const { assignments } = db;
        db.assignments = assignments.filter((a) => a._id !== assignmentId);
        return { deletedCount: assignments.length - db.assignments.length };
    }

    function updateAssignment(assignmentId, assignmentUpdates) {
        const { assignments } = db;
        const found = assignments.find((a) => a._id === assignmentId);
        if (!found) return null;
        Object.assign(found, assignmentUpdates);
        return found;
    }

    return {
        findAssignmentsForCourse,
        createAssignment,
        deleteAssignment,
        updateAssignment,
    };
}
