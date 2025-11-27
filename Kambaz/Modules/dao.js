// Kambaz/Modules/dao.js
import { v4 as uuidv4 } from "uuid";
import ModuleModel from "./model.js";

export default function ModulesDao(db) {
    // 6.4.2 – modules in their own collection, related to courses by course field

    // find all modules for a given course
    async function findModulesForCourse(courseId) {
        return ModuleModel.find({ course: courseId });
    }

    // create a module for a course
    async function createModule(courseId, module) {
        const newModule = {
            ...module,
            _id: uuidv4(),
            course: courseId,
            lessons: module.lessons || [],
        };
        const created = await ModuleModel.create(newModule);
        return created;
    }

    // delete a module
    async function deleteModule(courseId, moduleId) {
        // courseId is in the URL but we don't actually need it for deletion
        return ModuleModel.deleteOne({ _id: moduleId });
    }

    // update a module
    async function updateModule(courseId, moduleId, moduleUpdates) {
        const status = await ModuleModel.updateOne(
            { _id: moduleId },
            { $set: moduleUpdates }
        );
        if (!status.matchedCount) return null;
        return ModuleModel.findById(moduleId);
    }

    return {
        findModulesForCourse,
        createModule,
        deleteModule,
        updateModule,
    };
}
