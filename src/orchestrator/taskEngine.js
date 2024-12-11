// src\orchestrator\taskEngine.js
const logger = require("../helpers/logger");
const TaskExecutor = require("./taskExecutor");
const TaskState = require("./taskState");
const {
  TASK_STATES,
  TASK_STATUSES,
  ACTION_TYPES,
} = require("../models/mongoModel");
const EventEmitter = require("events");
const executeOnFailure = require("./executeOnFailure");
module.exports = class TaskEngine extends EventEmitter {
  constructor(task, taskRepository) {
    super();
    this.task = task;
    this.state = new TaskState(task);
    this.executor = new TaskExecutor(task, taskRepository);
    this.taskRepository = taskRepository;
  }

  async handleFailure(error) {
    logger.error("handleFailure : Task failed", error);
    const failureHook = this.task.on_failure?.[0];
    if (failureHook) {
      await executeOnFailure(failureHook);
    }
  }

  async waitForDependencies() {
    for (const dependency of this.task.dependencies) {
      logger.info(`Checking dependency - ${dependency.name}`);

      if (!dependency) {
        throw new Error(`Dependency task with id ${dependency._id} not found.`);
      }

      await new Promise((resolve, reject) => {
        const checkDependency = (updatedTask) => {
          if (updatedTask._id.toString() === dependency._id.toString() &&
            updatedTask.state === TASK_STATES.COMPLETED) {
            logger.info(`Dependency ${dependency.name} is completed.`);
            this.taskRepository.off('taskUpdated', checkDependency);
            resolve();
          }
        };

        this.taskRepository.on('taskUpdated', checkDependency);
      });
    }
  }



  async start() {
    try {
      logger.info(`Starting task - ${this.task.name}`);

      // 1. Update task state to 'WAITING' before starting execution
      await this.state.updateState(TASK_STATES.WAITING);

      // 2. Check dependencies and wait for completion
      await this.waitForDependencies();

      // 3. Proceed with starting the task
      await this.state.updateState(TASK_STATES.RUNNING);
      this.emit(ACTION_TYPES.START, this.task);
      await this.executor.execute();

      // 4. Mark task as completed once the execution is finished
      await this.state.updateState(TASK_STATES.COMPLETED);
      this.emit(TASK_STATES.COMPLETED, this.task);
    } catch (error) {
      await this.state.updateState(TASK_STATES.FAILED);
      await this.handleFailure(error);
      this.emit(TASK_STATES.FAILED, this.task, error);
    }
  }

  async stop() {
    await this.state.updateState(TASK_STATES.STOPPED);
    this.task.status = TASK_STATUSES.STOPPED;
    this.emit(TASK_STATES.STOPPED, this.task);
  }

  async pause() {
    await this.state.updateState(TASK_STATES.PAUSED);
    this.task.status = TASK_STATUSES.PAUSED;
    this.emit(TASK_STATES.PAUSED, this.task);
  }

  async resume() {
    await this.state.updateState(TASK_STATES.RUNNING);
    this.task.status = TASK_STATUSES.RESUMED;
    await this.executor.execute();
    await this.state.updateState(TASK_STATES.COMPLETED);
    this.task.status = TASK_STATUSES.COMPLETED;
    this.emit(TASK_STATES.RUNNING, this.task);
    this.emit(TASK_STATES.COMPLETED, this.task);
  }

  async restart() {
    try {
      await this.state.updateState(TASK_STATES.RESTARTED);
      this.task.status = TASK_STATUSES.RESTARTED;
      this.emit(TASK_STATUSES.RESTARTED, this.task);
      await this.executor.execute();
      await this.state.updateState(TASK_STATES.COMPLETED);
      this.task.status = TASK_STATUSES.COMPLETED;
      this.emit(TASK_STATES.COMPLETED, this.task);
    } catch (error) {
      await this.state.updateState(TASK_STATES.FAILED);
      await this.handleFailure(error);
      this.emit(TASK_STATES.FAILED, error);
    }
  }
};
