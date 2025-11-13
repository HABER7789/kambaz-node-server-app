
import UsersDao from "./dao.js";

export default function UserRoutes(app, db) {
    const dao = UsersDao(db);


    app.use("/api/users", (req, res, next) => {
        console.log(`🧪 [USERS] ${req.method} ${req.originalUrl}`);
        console.log("   cookies:", req.headers.cookie || "(none)");
        console.log(
            "   session currentUser:",
            req.session?.currentUser || "(none)"
        );
        next();
    });

    const createUser = (req, res) => {
        const user = dao.createUser(req.body);
        res.json(user);
    };

    const deleteUser = (req, res) => {
        const ok = dao.deleteUser(req.params.userId);
        if (!ok) return res.status(404).json({ message: "User not found" });
        res.sendStatus(200);
    };

    const findAllUsers = (req, res) => res.json(dao.findAllUsers());

    const findUserById = (req, res) => {
        const user = dao.findUserById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    };

    const updateUser = (req, res) => {
        const userId = req.params.userId;
        const updates = req.body;

        const updatedUser = dao.updateUser(userId, updates);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Only update session.currentUser if THIS is the logged-in user
        const current = req.session["currentUser"];
        if (current && current._id === userId) {
            req.session["currentUser"] = updatedUser;
        }

        res.json(updatedUser);
    };


    const signup = (req, res) => {
        const { username } = req.body;
        const taken = dao.findUserByUsername(username);
        if (taken) {
            return res.status(400).json({ message: "Username already in use" });
        }
        const currentUser = dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signin = (req, res) => {
        const { username, password } = req.body;
        const user = dao.findUserByCredentials(username, password);
        if (!user) return res.status(401).json({ message: "Invalid credentials" });
        const currentUser = dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(401).json({ message: "Unable to login. Try again later." });
        }
    };

    const signout = (req, res) => {

        req.session.destroy();
        res.sendStatus(200);
    };

    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };

    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);

    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
}
