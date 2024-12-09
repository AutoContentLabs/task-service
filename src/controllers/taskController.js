// src\controllers\taskController.js
const taskService = require('../services/taskService');

class TaskController {

    async create(req, res) {
        try {
            const newModel = await taskService.create(req.body);
            res.status(201).json(newModel);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const updatedModel = await taskService.update(req.params.id, req.body);
            res.status(200).json(updatedModel);
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
            const list = await taskService.getAll();
            res.status(200).json(list);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async start(req, res) {
        try {
            const model = await taskService.start(req.params.id);
            res.status(200).json({ message: 'started successfully', model });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async stop(req, res) {
        try {
            const model = await taskService.stop(req.params.id);
            res.status(200).json({ message: 'stopped successfully', model });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async pause(req, res) {
        try {
            const model = await taskService.pause(req.params.id);
            res.status(200).json({ message: 'paused successfully', model });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async resume(req, res) {
        try {
            const model = await taskService.resume(req.params.id);
            res.status(200).json({ message: 'resume successfully', model });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async restart(req, res) {
        try {
            const model = await taskService.restart(req.params.id);
            res.status(200).json({ message: 'restart successfully', model });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TaskController();
