// Kambaz/Assignments/routes.js
import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
    const dao = AssignmentsDao(db);

    // GET /api/courses/:courseId/assignments
    const findAssignmentsForCourse = async (req, res) => {
        const { courseId } = req.params;
        const assignments = await dao.findAssignmentsForCourse(courseId);
        res.json(assignments);
    };

    // POST /api/courses/:courseId/assignments
    const createAssignmentForCourse = async (req, res) => {
        const { courseId } = req.params;
        const assignment = {
            ...req.body,
            course: courseId,
        };
        const newAssignment = await dao.createAssignment(assignment);
        res.send(newAssignment);
    };

    // DELETE /api/assignments/:assignmentId
    const deleteAssignment = async (req, res) => {
        const { assignmentId } = req.params;
        const status = await dao.deleteAssignment(assignmentId);
        res.send(status);
    };

    // PUT /api/assignments/:assignmentId
    const updateAssignment = async (req, res) => {
        const { assignmentId } = req.params;
        const assignmentUpdates = req.body;
        const updated = await dao.updateAssignment(
            assignmentId,
            assignmentUpdates
        );
        if (!updated) {
            res.sendStatus(404);
            return;
        }
        res.send(updated);
    };

    app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
    app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
    app.delete("/api/assignments/:assignmentId", deleteAssignment);
    app.put("/api/assignments/:assignmentId", updateAssignment);
}
