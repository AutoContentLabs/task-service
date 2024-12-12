const express = require("express");
const router = express.Router();
try {
    const TaskRepository = require("../repositories/taskRepository");
    const TaskService = require("../services/taskService");
    const TaskController = require("../controllers/taskController");
    const TaskEngine = require("../orchestrator/taskEngine");

    const taskRepository = new TaskRepository();
    const taskEngine = new TaskEngine();
    const taskService = new TaskService(taskRepository, taskEngine);
    const taskController = new TaskController(taskService);

    const {
        create,
        update,
        deleteById,
        getById,
        getAll,
        start,
        stop,
        pause,
        resume,
        restart,
        updates
    } = taskController;

    router.post("/tasks", create);
    router.put("/tasks/:id", update);
    router.delete("/tasks/:id", deleteById);
    router.get("/tasks/:id", getById);
    router.get("/tasks", getAll);

    router.post("/tasks/:id/start", start);
    router.post("/tasks/:id/stop", stop);
    router.post("/tasks/:id/pause", pause);
    router.post("/tasks/:id/resume", resume);
    router.post("/tasks/:id/restart", restart);

    router.get("/tasks-updates", updates);
} catch (error) {
    console.error("router", error);
}

module.exports = router;
