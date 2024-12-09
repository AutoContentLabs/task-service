// src\services\taskService.js
const { TaskEngine } = require('../orchestrator');
const taskRepository = require('../repositories/taskRepository');

class TaskService {
    async create(model) {
        return await taskRepository.create(model);
    }

    async update(id, model) {
        return await taskRepository.update(taskId, updateData);
    }

    async deleteById(id) {
        return await taskRepository.deleteById(id);
    }

    async getById(id) {
        return await taskRepository.getById(id);
    }

    async getAll() {
        return await taskRepository.getAll();
    }

    async start(id) {

        const task = await this.getTaskById(id);
        if (!task) {
            return null
        }

        task.status = 'STARTED';

        task.actions.push({
            type: 'START',
            timestamp: new Date(),
            details: 'Task started via API'
        });

        const result = this.updateTask(id, task)

        // Task Engine
        new TaskEngine(task)

        return result;
    }

    async stop(id) {

        const task = await this.getTaskById(id);
        if (!task) {
            return null
        }

        task.status = 'STOPPED';

        task.actions.push({
            type: 'STOP',
            timestamp: new Date(),
            details: 'Task stopped via API'
        });

        const result = this.updateTask(id, task)

        return result;
    }
    async pause(id) {

        const task = await this.getTaskById(id);
        if (!task) {
            return null
        }

        task.status = 'PAUSED';

        task.actions.push({
            type: 'PAUSE',
            timestamp: new Date(),
            details: 'Task paused via API'
        });

        const result = this.updateTask(id, task)

        return result;
    }

    async resume(id) {
        const task = await this.getTaskById(id);
        if (!task) {
            return null
        }

        task.status = 'RESUMED';

        task.actions.push({
            type: 'RESUME',
            timestamp: new Date(),
            details: 'Task resumed via API'
        });

        const result = this.updateTask(id, task)

        return result;
    }

    async restart(id) {
        const task = await this.getTaskById(id);
        if (!task) {
            return null
        }

        task.status = 'RESTARTED';

        task.actions.push({
            type: 'RESTART',
            timestamp: new Date(),
            details: 'Task resumed via API'
        });

        const result = this.updateTask(id, task)

        return result;
    }

}

module.exports = new TaskService();
