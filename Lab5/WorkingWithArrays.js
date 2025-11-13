
let todos = [
    { id: 1, title: "Task 1", completed: false, description: "" },
    { id: 2, title: "Task 2", completed: true, description: "" },
    { id: 3, title: "Task 3", completed: false, description: "" },
    { id: 4, title: "Task 4", completed: true, description: "" },
];

export default function WorkingWithArrays(app) {
    const getTodos = (req, res) => {
        const { completed } = req.query;
        if (completed !== undefined) {
            const want = completed === "true";
            return res.json(todos.filter(t => t.completed === want));
        }
        res.json(todos);
    };

    const getTodoById = (req, res) => {
        const id = parseInt(req.params.id, 10);
        const todo = todos.find(t => t.id === id);
        if (!todo) return res.status(404).json({ error: "Todo not found" });
        res.json(todo);
    };

    const createNewTodo = (req, res) => {
        const nextId = todos.length === 0 ? 1 : Math.max(...todos.map(t => t.id)) + 1;
        const title = req.query.title || "New Task";
        const newTodo = { id: nextId, title, completed: false, description: "" };
        todos.push(newTodo);
        res.json(todos);
    };

    const removeTodo = (req, res) => {
        const id = parseInt(req.params.id, 10);
        const idx = todos.findIndex(t => t.id === id);
        if (idx === -1) {
            return res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
        }
        todos.splice(idx, 1);
        res.json(todos);
    };

    const updateTodoTitle = (req, res) => {
        const id = parseInt(req.params.id, 10);
        const { title } = req.params;
        const todo = todos.find(t => t.id === id);
        if (!todo) return res.status(404).json({ error: "Todo not found" });
        todo.title = title;
        res.json(todos);
    };


    const updateTodoCompleted = (req, res) => {
        const id = parseInt(req.params.id, 10);
        const { completed } = req.params; // "true" | "false"
        const todo = todos.find(t => t.id === id);
        if (!todo) return res.status(404).json({ error: "Todo not found" });
        todo.completed = completed === "true";
        res.json(todos);
    };


    const updateTodoDescription = (req, res) => {
        const id = parseInt(req.params.id, 10);
        const { description } = req.params;
        const todo = todos.find(t => t.id === id);
        if (!todo) return res.status(404).json({ error: "Todo not found" });
        todo.description = description;
        res.json(todos);
    };

    const postNewTodo = (req, res) => {
        const newTodo = { ...req.body, id: new Date().getTime() };
        todos.push(newTodo);
        res.json(newTodo);
    };

    const deleteTodo = (req, res) => {
        const { id } = req.params;
        const idx = todos.findIndex((t) => t.id === parseInt(id, 10));
        if (idx === -1) return res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
        todos.splice(idx, 1);
        res.sendStatus(200);
    };

    const updateTodo = (req, res) => {
        const { id } = req.params;
        let found = false;
        todos = todos.map((t) => {
            if (t.id === parseInt(id, 10)) {
                found = true;
                return { ...t, ...req.body };
            }
            return t;
        });
        if (!found) return res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
        res.sendStatus(200);
    };

    app.put("/lab5/todos/:id", updateTodo);
    app.delete("/lab5/todos/:id", deleteTodo);
    app.get("/lab5/todos/:id/title/:title", updateTodoTitle);
    app.get("/lab5/todos/:id/completed/:completed", updateTodoCompleted);
    app.get("/lab5/todos/:id/description/:description", updateTodoDescription);
    app.get("/lab5/todos/:id/delete", removeTodo);
    app.get("/lab5/todos/create", createNewTodo);
    app.post("/lab5/todos", postNewTodo);
    app.get("/lab5/todos", getTodos);
    app.get("/lab5/todos/:id", getTodoById);
}
