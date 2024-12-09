// src\controllers\taskController.js
const taskService = require('../services/taskService');

class TaskController {
    async createTask(req, res) {
        try {
            const newTask = await taskService.createTask(req.body);
            res.status(201).json(newTask);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getTaskById(req, res) {
        try {
            const task = await taskService.getTaskById(req.params.id);
            res.status(200).json(task);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllTasks(req, res) {
        try {
            const tasks = await taskService.getAllTasks();
            res.status(200).json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateTask(req, res) {
        try {
            const updatedTask = await taskService.updateTask(req.params.id, req.body);
            res.status(200).json(updatedTask);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteTask(req, res) {
        try {
            await taskService.deleteTask(req.params.id);
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async startTask(req, res) {
        try {
            const task = await taskService.startTask(req.params.id);
            res.status(200).json({ message: 'task started successfully', task });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async pauseTask(req, res) {
        try {
            const task = await taskService.pauseTask(req.params.id);
            res.status(200).json({ message: 'task paused successfully', task });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async stopTask(req, res) {
        try {
            const task = await taskService.stopTask(req.params.id);
            res.status(200).json({ message: 'task stopped successfully', task });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TaskController();
