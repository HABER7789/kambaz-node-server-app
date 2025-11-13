import ModulesDao from "../Modules/dao.js";

export default function ModulesRoutes(app, db) {
    const dao = ModulesDao(db);

    const findModulesForCourse = (req, res) => {
        const { courseId } = req.params;
        const modules = dao.findModulesForCourse(courseId);
        res.json(modules);
    };

    const createModuleForCourse = (req, res) => {
        const { courseId } = req.params;
        const module = {
            ...req.body,
            course: courseId,
        };
        const newModule = dao.createModule(module);
        res.send(newModule);
    };

    const deleteModule = (req, res) => {
        const { moduleId } = req.params;
        const status = dao.deleteModule(moduleId);
        res.send(status);
    };

    const updateModule = (req, res) => {
        const { moduleId } = req.params;
        const moduleUpdates = req.body;
        const module = dao.updateModule(moduleId, moduleUpdates);
        if (!module) {
            res.sendStatus(404);
            return;
        }
        res.send(module);
    };

    app.post("/api/courses/:courseId/modules", createModuleForCourse);
    app.get("/api/courses/:courseId/modules", findModulesForCourse);
    app.delete("/api/modules/:moduleId", deleteModule);
    app.put("/api/modules/:moduleId", updateModule);
}
