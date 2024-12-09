// src\services\taskService.js
const { TaskEngine } = require('../orchestrator');
const taskRepository = require('../repositories/taskRepository');

class TaskService {
    async createTask(taskData) {
        return await taskRepository.createTask(taskData);
    }

    async getTaskById(taskId) {
        return await taskRepository.getTaskById(taskId);
    }

    async getAllTasks() {
        return await taskRepository.getAllTasks();
    }

    async updateTask(taskId, updateData) {
        return await taskRepository.updateTask(taskId, updateData);
    }

    async deleteTask(taskId) {
        return await taskRepository.deleteTask(taskId);
    }

    async startTask(taskId) {

        const task = await this.getTaskById(taskId);
        if (!task) {
            return null
        }

        task.status = 'STARTED';

        task.actions.push({
            type: 'START',
            timestamp: new Date(),
            details: 'Task started via API'
        });

        const result = this.updateTask(taskId, task)
        
        // Task Engine
        new TaskEngine(task)
        
        return result;
    }

    

    async pauseTask(taskId) {

        const task = await this.getTaskById(taskId);
        if (!task) {
            return null
        }

        task.status = 'PAUSED';

        task.actions.push({
            type: 'PAUSE',
            timestamp: new Date(),
            details: 'Task paused via API'
        });

        const result = this.updateTask(taskId, task)

        return result;
    }

    async stopTask(taskId) {

        const task = await this.getTaskById(taskId);
        if (!task) {
            return null
        }

        task.status = 'STOPPED';

        task.actions.push({
            type: 'STOP',
            timestamp: new Date(),
            details: 'Task stopped via API'
        });

        const result = this.updateTask(taskId, task)

        return result;
    }
}

module.exports = new TaskService();
