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
const { generateHeaders } = require("../helpers/helper");

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

    async safeExecute(fn) {
        try {
            return await fn();
        } catch (error) {
            logger.error("Error executing function", error);
        }
    }

    watch = async () => {
        this.taskRepository.on("UPDATED", async (updatedModel) => {
            const { _id: id, name, status, state, actions } = updatedModel;
            this.emit("UPDATED", updatedModel);
            this.safeExecute(async () => {
                const lastActionType = actions[actions.length - 1]?.type;
                logger.debug(
                    `REPO UPDATED - id: ${id} action: ${lastActionType} - name: ${name} - status: ${status} - state: ${state}`,
                    { id, name, status, state, action: lastActionType }
                );

                const actionHandlers = {
                    [ACTION_TYPES.START]: () => this.taskEngine.start(id),
                    [ACTION_TYPES.PAUSE]: () => this.taskEngine.pauseTask(id),
                    [ACTION_TYPES.RESUME]: () => this.taskEngine.resumeTask(id),
                    [ACTION_TYPES.STOP]: () => this.taskEngine.stopTask(id),
                    [ACTION_TYPES.CANCEL]: () => this.taskEngine.cancelTask(id),
                    [ACTION_TYPES.RESTART]: () => this.taskEngine.restartTask(id),
                };

                if (actionHandlers[lastActionType]) {
                    actionHandlers[lastActionType]();
                }
            });
        });

        this.taskRepository.on("CREATED", async (updatedModel) => {
            const { _id: id, name, status, state, dependencies } = updatedModel;
            this.safeExecute(async () => {
                logger.debug(
                    `Task CREATED - id: ${id} name: ${name} - status: ${status} - state: ${state}`,
                    { id, name, status, state }
                );
                const dependenciesArray = dependencies.map((task) =>
                    task._id.toString()
                );
                this.taskEngine.createTask({
                    id,
                    name,
                    priority: 1,
                    maxAttempts: 3,
                    dependencies: dependenciesArray,
                });
            });
        });

        this.taskRepository.on("DELETED", async (updatedModel) => {
            const { _id: id, name, status, state } = updatedModel;
            this.safeExecute(async () => {
                logger.debug(
                    `Task DELETED - id: ${id} name: ${name} - status: ${status} - state: ${state}`,
                    { id, name, status, state }
                );
            });
        });

        for (const state of Object.values(TASK_STATES)) {
            this.taskEngine.on(state, async ({ id, name }) => {
                this.safeExecute(async () => {
                    const model = await this.getById(id);
                    model.state = state;
                    await this.update(id, model);
                });
            });
        }
    };

    create = async (model) => {
        return await this.safeExecute(async () => {
            model.headers = generateHeaders("Task");
            return await this.taskRepository.create(model);
        });
    };

    update = async (id, model) => {
        return await this.safeExecute(async () =>
            this.taskRepository.update(id, model)
        );
    };

    deleteById = async (id) => {
        return await this.safeExecute(async () =>
            this.taskRepository.deleteById(id)
        );
    };

    getById = async (id) => {
        return await this.safeExecute(async () => this.taskRepository.getById(id));
    };

    getAll = async () => {
        return await this.safeExecute(async () => this.taskRepository.getAll());
    };
}

const createTaskMethod = (name, action, status, state) => {
    TaskService.prototype[name] = async function (id) {
        return await this.safeExecute(async () => {
            const model = await this.getById(id);

            model.actions.push({
                type: action,
                timestamp: new Date(),
            });

            model.status = status;
            model.state = state;

            return await this.update(id, model);
        });
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
