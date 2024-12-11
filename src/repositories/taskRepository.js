/**
 * @file src/repositories/taskRepository.js
 */

const EventEmitter = require("events");
const { Task } = require("../models/mongoModel");

class TaskRepository extends EventEmitter {
    constructor() {
        super();

        if (TaskRepository.instance) {
            return TaskRepository.instance;
        }

        TaskRepository.instance = this;
    }

    create = async (model) => {
        const createdModel = await Task.create(model);

        const population = await this.getById(createdModel._id);

        this.emit("CREATED", population);

        return population;
    };

    update = async (id, model) => {
        const updatedModel = await Task.findByIdAndUpdate(id, model, { new: true })
            .populate("dependencies")
            .populate("actions");

        this.emit("UPDATED", updatedModel);

        return updatedModel;
    };

    deleteById = async (id) => {
        const deletedModel = await Task.findByIdAndDelete(id);

        this.emit("DELETED", deletedModel);

        return deletedModel;
    };

    getById = async (id) => {
        return await Task.findById(id).populate("dependencies").populate("actions");
    };

    getAll = async () => {
        return await Task.find();
    };
}

module.exports = TaskRepository;
