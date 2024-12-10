const logger = require("../helpers/logger");
const TaskExecutor = require("./taskExecutor");
const TaskState = require("./taskState");
const { executeOnFailure, TASK_STATES, TASK_STATUSES, ACTION_TYPES } = require("../models/mongoModel");
const EventEmitter = require('events');

module.exports = class TaskEngine extends EventEmitter {
  constructor(task) {
    super();
    this.task = task;
    this.state = new TaskState(task);
    this.executor = new TaskExecutor(task);
  }

  async handleFailure(error) {
    logger.error("Task failed", error);
    const failureHook = this.task.on_failure?.[0];
    if (failureHook) {
      await executeOnFailure(failureHook);
    }
  }

  async start() {
    try {
      await this.state.updateState(TASK_STATES.RUNNING);
      this.emit(ACTION_TYPES.START, this.task);
      await this.executor.execute();
      await this.state.updateState(TASK_STATES.COMPLETED);
      this.emit(TASK_STATES.COMPLETED, this.task);
    } catch (error) {
      await this.state.updateState(TASK_STATES.FAILED);
      await this.handleFailure(error);
      this.emit(TASK_STATES.FAILED, error);
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
    this.emit(TASK_STATES.RUNNING, this.task);
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
