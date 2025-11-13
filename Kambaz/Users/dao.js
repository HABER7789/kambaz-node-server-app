// Kambaz/Users/dao.js
import { v4 as uuidv4 } from "uuid";

export default function UsersDao(db) {
    const users = db.users;

    const findAllUsers = () => users;
    const findUserById = (id) => users.find((u) => u._id === id);
    const findUserByCredentials = (username, password) =>
        users.find((u) => u.username === username && u.password === password);

    
    const findUserByUsername = (username) =>
        users.find((u) => u.username === username);

    const createUser = (user) => {
        const newUser = { ...user, _id: uuidv4() }; 
        users.push(newUser);
        return newUser;
    };

    const updateUser = (id, updates) => {
        const i = users.findIndex((u) => u._id === id);
        if (i === -1) return null;
        users[i] = { ...users[i], ...updates };
        return users[i];
    };

    const deleteUser = (id) => {
        const i = users.findIndex((u) => u._id === id);
        if (i === -1) return false;
        users.splice(i, 1);
        return true;
    };
    

    return {
        findAllUsers,
        findUserById,
        findUserByCredentials,
        findUserByUsername,     
        createUser,
        updateUser,
        deleteUser,
    };
}
