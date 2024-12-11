/**
 * @file src/services/taskService.js
 */

const logger = require("../helpers/logger")
const EventEmitter = require("events");
const {
    ACTION_TYPES,
    TASK_STATUSES,
    TASK_STATES,
    TASK_TYPES,
} = require("../models/mongoModel");
const { generateHeaders } = require("../utils/messaging");

class TaskService extends EventEmitter {
    constructor(taskRepository) {
        super();

        if (TaskService.instance) {
            return TaskService.instance;
        }

        TaskService.instance = this;
        this.taskRepository = taskRepository;
        this.watch();
    }

    watch = async () => {
        this.taskRepository.on("UPDATED", (updatedModel) => {
            logger.debug(`REPO UPDATED - name: ${updatedModel.name} - status: ${updatedModel.status} - state: ${updatedModel.state}`, {
                name: updatedModel.name,
                status: updatedModel.status,
                state: updatedModel.state,
            })
        });

        this.taskRepository.on("CREATED", (updatedModel) => {
            logger.debug(`Task CREATED - name: ${updatedModel.name} - status: ${updatedModel.status} - state: ${updatedModel.state}`, {
                name: updatedModel.name,
                status: updatedModel.status,
                state: updatedModel.state,
            });
        });

        this.taskRepository.on("DELETED", (updatedModel) => {
            logger.debug(`Task DELETED - name: ${updatedModel.name} - status: ${updatedModel.status} - state: ${updatedModel.state}`, {
                name: updatedModel.name,
                status: updatedModel.status,
                state: updatedModel.state,
            });
        });
    };

    create = async (model) => {
        model.headers = generateHeaders("Task");
        return await this.taskRepository.create(model);
    };

    update = async (id, model) => {
        return await this.taskRepository.update(id, model);
    };

    deleteById = async (id) => {
        return await this.taskRepository.deleteById(id);
    };

    getById = async (id) => {
        return await this.taskRepository.getById(id);
    };

    getAll = async () => {
        return await this.taskRepository.getAll();
    };
}

const createTaskMethod = async (name, action, status, state) => {
    TaskService.prototype[name] = async function (id) {
        const model = await this.getById(id);

        model.actions.push({
            type: action,
            timestamp: new Date(),
        });

        model.status = status;
        model.state = state;

        const updatedModel = await this.update(model.id, model);

        return updatedModel;
    };
};

createTaskMethod(
    "start",
    ACTION_TYPES.START,
    TASK_STATUSES.STARTED,
    TASK_STATES.WAITING
);
createTaskMethod(
    "stop",
    ACTION_TYPES.STOP,
    TASK_STATUSES.STOPPED,
    TASK_STATES.STOPPED
);
createTaskMethod(
    "pause",
    ACTION_TYPES.PAUSE,
    TASK_STATUSES.PAUSED,
    TASK_STATES.PAUSED
);
createTaskMethod(
    "resume",
    ACTION_TYPES.RESUME,
    TASK_STATUSES.RESUMED,
    TASK_STATES.RUNNING
);
createTaskMethod(
    "restart",
    ACTION_TYPES.RESTART,
    TASK_STATUSES.RESTARTED,
    TASK_STATES.RUNNING
);

module.exports = TaskService;
