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
}

module.exports = new TaskService();
