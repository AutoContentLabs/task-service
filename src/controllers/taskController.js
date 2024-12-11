/**
 * @file src/controllers/taskController.js
 */

const EventEmitter = require("events");

class TaskController extends EventEmitter {
    constructor(taskService) {
        super();

        if (TaskController.instance) {          
            return TaskController.instance;
        }

        TaskController.instance = this;
        this.taskService = taskService;
    }

    create = async (req, res) => {
        try {
            const newModel = await this.taskService.create(req.body);
            res.status(201).json(newModel);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    update = async (req, res) => {
        try {
            const updatedModel = await this.taskService.update(
                req.params.id,
                req.body
            );
            res.status(200).json(updatedModel);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    deleteById = async (req, res) => {
        try {
            const result = await this.taskService.deleteById(req.params.id);
            if (result) {
                res.status(204).end();
            } else {
                res.status(404).json({ error: "Task not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    getById = async (req, res) => {
        try {
            const task = await this.taskService.getById(req.params.id);
            res.status(200).json(task);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    getAll = async (req, res) => {
        try {
            const list = await this.taskService.getAll();
            res.status(200).json(list);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    start = async (req, res) => {
        try {
            const model = await this.taskService.start(req.params.id);
            res.status(200).json({ message: "started successfully", model });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    stop = async (req, res) => {
        try {
            const model = await this.taskService.stop(req.params.id);
            res.status(200).json({ message: "stopped successfully", model });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    pause = async (req, res) => {
        try {
            const model = await this.taskService.pause(req.params.id);
            res.status(200).json({ message: "paused successfully", model });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    resume = async (req, res) => {
        try {
            const model = await this.taskService.resume(req.params.id);
            res.status(200).json({ message: "resume successfully", model });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    restart = async (req, res) => {
        try {
            const model = await this.taskService.restart(req.params.id);
            res.status(200).json({ message: "restart successfully", model });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = TaskController;
