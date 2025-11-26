// Kambaz/Users/dao.js
import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function UsersDao(/* db */) {
    const findAllUsers = () => model.find();

    const findUserById = (id) => model.findById(id);

    const findUserByUsername = (username) =>
        model.findOne({ username });

    const findUserByCredentials = (username, password) =>
        model.findOne({ username, password });

    // NEW: filter by exact role
    const findUsersByRole = (role) => model.find({ role });

    // NEW: filter by partial first/last name (case-insensitive)
    const findUsersByPartialName = (partialName) => {
        const regex = new RegExp(partialName, "i");
        return model.find({
            $or: [
                { firstName: { $regex: regex } },
                { lastName: { $regex: regex } },
            ],
        });
    };

    const createUser = (user) => {
        const newUser = { ...user, _id: uuidv4() };
        return model.create(newUser); // insert new user into DB
    };



    const updateUser = (id, updates) =>
        model.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );

    const deleteUser = (id) =>
        model.deleteOne({ _id: id });

    return {
        findAllUsers,
        findUserById,
        findUserByCredentials,
        findUserByUsername,
        findUsersByRole,
        findUsersByPartialName,
        createUser,
        updateUser,
        deleteUser,
    };
}
