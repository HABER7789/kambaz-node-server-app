// Kambaz/Modules/model.js
import mongoose from "mongoose";
import schema from "./schema.js";

const ModuleModel = mongoose.model("ModuleModel", schema);
export default ModuleModel;
