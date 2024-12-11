/**
 * @file src\repositories\taskRepository.js
 */
const EventEmitter = require('events');
const { Task } = require('../models/mongoModel');

class TaskRepository extends EventEmitter {

    /**
     * 
     * @param {Task} model 
     * @returns 
     */
    async create(model) {
        return await Task.create(model);
    }

    async update(id, model) {
        const updatedTask = await Task.findByIdAndUpdate(id, model, { new: true }).populate("dependencies");
        if (updatedTask) {
            this.emit('taskUpdated', updatedTask);
        }
        return updatedTask;
    }

    async deleteById(id) {
        return await Task.findByIdAndDelete(id);
    }

    async getById(id) {
        return await Task.findById(id).populate("dependencies");
    }

    async getAll() {
        return await Task.find();
    }

}

module.exports = new TaskRepository();
