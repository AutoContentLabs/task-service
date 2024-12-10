// src\services\taskService.js

const { TaskEngine } = require("../orchestrator");
const taskRepository = require("../repositories/taskRepository");
const { sendSignal, generateHeaders } = require("../utils/messaging");
const {
    TASK_STATES,
    TASK_STATUSES,
    ACTION_TYPES,
} = require("../models/mongoModel");
const logger = require("../helpers/logger");
const EventEmitter = require('events');

/**
 * @class TaskService
 * @description Manages task-related operations like state updates and action handling.
 * @method {Function} create - Creates a new task in the repository.
 * @method {Function} update - Updates an existing task in the repository.
 * @method {Function} deleteById - Deletes a task by its ID.
 * @method {Function} getById - Fetches a task by its ID.
 * @method {Function} getAll - Fetches all tasks.
 * @method {Function} createTaskMethod - Dynamically creates task methods like start, stop, etc.
 * @method {Function} start - 
 * @method {Function} stop -
 * @method {Function} pause -
 * @method {Function} resume - 
 * @method {Function} restart - 
 */
class TaskService extends EventEmitter {
    constructor() {
        super();
    }

    async create(model) {
        // correlationId  traceId type(schemaType) for service tracing
        model.headers = generateHeaders("Task");
        return await taskRepository.create(model);
    }

    async update(id, model) {
        return await taskRepository.update(id, model);
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

    async updateTaskState(id, status, state, action) {
        const model = await this.getById(id);
        if (!model) throw new Error('Task not found');

        model.status = status;
        model.state = state;

        model.actions.push({
            type: action,
            timestamp: new Date(),
            details: `${model.status} via API or EVENTS`,
        });

        const result = await this.update(id, model);
        return result;
    }

    static createTaskMethod(name, status, state, action) {
        TaskService.prototype["methods"]?.push(name);

        TaskService.prototype[name] = async function (id) {
            const model = await this.updateTaskState(id, status, state, action);
            this.emit(status, model);
            sendSignal(model);
            const engine = new TaskEngine(model);
            engine[name]();

            for (const state of Object.values(TASK_STATES)) {
                engine.on(state, (task) => {
                    logger.notice(`${task.state} - ${task.headers.correlationId} - ${task.type} - ${task.name}`);
                    this.emit(state, task);
                    sendSignal(task);
                });
            }

            return model;
        };
    }
}

TaskService.createTaskMethod('start', TASK_STATUSES.STARTED, TASK_STATES.RUNNING, ACTION_TYPES.START);
TaskService.createTaskMethod('stop', TASK_STATUSES.STOPPED, TASK_STATES.STOPPED, ACTION_TYPES.STOP);
TaskService.createTaskMethod('pause', TASK_STATUSES.PAUSED, TASK_STATES.PAUSED, ACTION_TYPES.PAUSE);
TaskService.createTaskMethod('resume', TASK_STATUSES.RESUMED, TASK_STATES.RUNNING, ACTION_TYPES.RESUME);
TaskService.createTaskMethod('restart', TASK_STATUSES.RESTARTED, TASK_STATES.RUNNING, ACTION_TYPES.RESTART);

module.exports = new TaskService();

