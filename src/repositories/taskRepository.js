const { Task } = require('../models/mongoModel');

class TaskRepository {
    async createTask(data) {
        return await Task.create(data);
    }

    async getTaskById(taskId) {
        return await Task.findById(taskId).populate('dependencies');
    }

    async getAllTasks() {
        return await Task.find();
    }

    async updateTask(taskId, updateData) {
        return await Task.findByIdAndUpdate(taskId, updateData, { new: true });
    }

    async deleteTask(taskId) {
        return await Task.findByIdAndDelete(taskId);
    }
}

module.exports = new TaskRepository();
