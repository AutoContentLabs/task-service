/**
 * @file src\repositories\taskRepository.js
 */
const { Task } = require('../models/mongoModel');

class TaskRepository {
    /**
     * 
     * @param {Task} model 
     * @returns 
     */
    async create(model) {
        return await Task.create(model);
    }

    async update(id, model) {
        return await Task.findByIdAndUpdate(id, model, { new: true });
    }

    async deleteById(id) {
        return await Task.findByIdAndDelete(id);
    }

    async getById(id) {
        return await Task.findById(id);
    }

    async getAll() {
        return await Task.find();
    }

}

module.exports = new TaskRepository();
