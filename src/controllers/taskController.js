// src\controllers\taskController.js
const taskService = require('../services/taskService');

class TaskController {

    async create(req, res) {
        try {
            const newTask = await taskService.create(req.body);
            res.status(201).json(newTask);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const updatedTask = await taskService.update(req.params.id, req.body);
            res.status(200).json(updatedTask);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteById(req, res) {
        try {
            await taskService.deleteById(req.params.id);
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const task = await taskService.getById(req.params.id);
            res.status(200).json(task);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const tasks = await taskService.getAll();
            res.status(200).json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async start(req, res) {
        try {
            const task = await taskService.start(req.params.id);
            res.status(200).json({ message: 'task started successfully', task });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async stop(req, res) {
        try {
            const task = await taskService.stop(req.params.id);
            res.status(200).json({ message: 'task stopped successfully', task });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async pause(req, res) {
        try {
            const task = await taskService.pause(req.params.id);
            res.status(200).json({ message: 'task paused successfully', task });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async resume(req, res) {
        try {
            const task = await taskService.resume(req.params.id);
            res.status(200).json({ message: 'task resume successfully', task });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async restart(req, res) {
        try {
            const task = await taskService.restart(req.params.id);
            res.status(200).json({ message: 'task restart successfully', task });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TaskController();
