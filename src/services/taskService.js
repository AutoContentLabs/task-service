// src\services\taskService.js
const {
    generateHeaders,
} = require("@auto-content-labs/messaging-utils/src/helpers/helper");
const { TaskEngine } = require("../orchestrator");
const taskRepository = require("../repositories/taskRepository");
const { sendSignal } = require("../utils/messaging");
const {
    TASK_STATES,
    TASK_STATUSES,
    ACTION_TYPES,
} = require("../models/mongoModel");
const logger = require("../helpers/logger");

class TaskService {
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

        const result = this.update(id, model);

        sendSignal(model);

        return result;
    }

    async start(id) {
        const model = await this.updateTaskState(
            id,
            TASK_STATUSES.STARTED,
            TASK_STATES.RUNNING,
            ACTION_TYPES.START
        );

        const engine = new TaskEngine(model);
        // we not waiting
        engine.start();

        engine.on(TASK_STATES.COMPLETED, (task) => {
            logger.notice(`${task.state} - ${task.headers.correlationId} - ${task.type} - ${task.name}`);
        });

        engine.on(TASK_STATES.FAILED, (error) => {
            logger.error(`${task.state} - ${task.headers.correlationId} - ${task.type} - ${task.name} - ${error.message}`);
        });

        return model;
    }

    async stop(id) {
        const model = await this.updateTaskState(
            id,
            TASK_STATUSES.STOPPED,
            TASK_STATES.STOPPED,
            ACTION_TYPES.STOP
        );

        const engine = new TaskEngine(model);
        // we not waiting
        engine.stop();

        return model;
    }

    async pause(id) {
        const model = await this.updateTaskState(
            id,
            TASK_STATUSES.PAUSED,
            TASK_STATES.PAUSED,
            ACTION_TYPES.PAUSE
        );

        const engine = new TaskEngine(model);
        // we not waiting
        engine.pause();

        return model;
    }

    async resume(id) {
        const model = await this.updateTaskState(
            id,
            TASK_STATUSES.RESUMED,
            TASK_STATES.RUNNING,
            ACTION_TYPES.RESUME
        );

        const engine = new TaskEngine(model);
        // we not waiting
        engine.resume();

        return model;
    }

    async restart(id) {
        const model = await this.updateTaskState(
            id,
            TASK_STATUSES.RESTARTED,
            TASK_STATES.RUNNING,
            ACTION_TYPES.RESTART
        );

        const engine = new TaskEngine(model);
        // we not waiting
        engine.restart();

        return model;
    }
}

module.exports = new TaskService();
