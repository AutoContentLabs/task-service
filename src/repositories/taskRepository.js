const { Task } = require('../models/mongoModel');

class TaskRepository {
    async create(data) {
        return await Task.create(data);
    }

    async update(taskId, updateData) {
        return await Task.findByIdAndUpdate(taskId, updateData, { new: true });
    }

    async deleteById(taskId) {
        return await Task.findByIdAndDelete(taskId);
    }

    async getById(taskId) {
        return await Task.findById(taskId);
    }

    async getAll() {
        return await Task.find();
    }

}

module.exports = new TaskRepository();
