/**
 * @file src/services/taskService.js
 */

const logger = require("../helpers/logger");
const EventEmitter = require("events");
const {
    ACTION_TYPES,
    TASK_STATUSES,
    TASK_STATES,
    TASK_TYPES,
} = require("../models/mongoModel");
const { generateHeaders } = require("../utils/messaging");

class TaskService extends EventEmitter {
    constructor(taskRepository, taskEngine) {
        super();

        if (TaskService.instance) {
            return TaskService.instance;
        }

        TaskService.instance = this;
        this.taskRepository = taskRepository;
        this.taskEngine = taskEngine;
        this.watch();
    }

    watch = async () => {
        this.taskRepository.on("UPDATED", (updatedModel) => {
            const { _id: id, name, status, state, actions } = updatedModel;
            const lastActionType = actions[actions.length - 1].type;
            logger.debug(
                `REPO UPDATED - id: ${id} action: ${lastActionType} - name: ${name} - status: ${status} - state: ${state}`,
                {
                    id,
                    name,
                    status,
                    state,
                    action: lastActionType,
                }
            );
            switch (lastActionType) {
                case ACTION_TYPES.START:
                    this.taskEngine.start();
                    break;
                case ACTION_TYPES.PAUSE:
                    this.taskEngine.pauseTask();
                    break;
                case ACTION_TYPES.RESUME:
                    this.taskEngine.resumeTask();
                    break;
                case ACTION_TYPES.STOP:
                    this.taskEngine.stopTask();
                    break;
                case "CANCEL":
                    this.taskEngine.cancelTask();
                    break;
                case ACTION_TYPES.RESTART:
                    this.taskEngine.restartTask();
                    break;

                default:
                    break;
            }
        });

        this.taskRepository.on("CREATED", (updatedModel) => {
            const { _id: id, name, status, state, dependencies } = updatedModel;
            logger.debug(
                `Task CREATED - id: ${id} name: ${name} - status: ${status} - state: ${state}`,
                {
                    id,
                    name,
                    status,
                    state,
                }
            );
            const dependenciesArray = dependencies.map((task) => task._id.toString());
            this.taskEngine.createTask({
                id,
                name,
                priority: 1,
                maxAttempts: 3,
                dependencies: dependenciesArray,
            });
        });

        this.taskRepository.on("DELETED", (updatedModel) => {
            const { _id: id, name, status, state } = updatedModel;
            logger.debug(
                `Task DELETED - id: ${id} name: ${name} - status: ${status} - state: ${state}`,
                {
                    id,
                    name,
                    status,
                    state,
                }
            );
        });

        this.taskEngine.on("taskSuccess", (task) =>
            console.log(`🎉 Event: Task [${task.id}] SUCCESS`)
        );
        this.taskEngine.on("taskFailed", (task) =>
            console.log(`⚠️ Event: Task [${task.id}] FAILED`)
        );
        this.taskEngine.on("taskCancelled", (task) =>
            console.log(`🚫 Event: Task [${task.id}] CANCELLED`)
        );
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
