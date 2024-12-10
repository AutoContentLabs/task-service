/**
 * @file src/orchestrator/taskEngine.js
 */
const logger = require("../helpers/logger");
const TaskExecutor = require("./taskExecutor");
const TaskState = require("./taskState");
const {
  executeOnFailure,
  TASK_STATES,
  TASK_STATUSES,
} = require("../models/mongoModel");

module.exports = class TaskEngine {
  constructor(task) {
    this.task = task;
    this.state = new TaskState(task);
    this.executor = new TaskExecutor(task);
  }

  async handleFailure(error) {
    logger.error("failed", error);
    const failureHook = this.task.on_failure?.[0];
    if (failureHook) {
      await executeOnFailure(failureHook);
    }
  }

  // TaskEngine start method
  async start() {
    try {
      await this.state.updateState(TASK_STATES.RUNNING);
      await this.executor.execute();
      await this.state.updateState(TASK_STATES.COMPLETED);
    } catch (error) {
      await this.state.updateState(TASK_STATES.FAILED);
      await this.handleFailure(error);
    }
  }

  async pause() {
    await this.state.updateState(TASK_STATES.PAUSED);
    this.task.status = TASK_STATUSES.PAUSED;
  }

  async resume() {
    await this.state.updateState(TASK_STATES.RUNNING);
    this.task.status = TASK_STATUSES.RESUMED;
    await this.executor.execute();
  }

  async restart() {
    await this.state.updateState(TASK_STATES.RESTARTED);
    this.task.status = TASK_STATUSES.RESTARTED;
    await this.executor.execute();
  }

  async stop() {
    await this.state.updateState(TASK_STATUSES.STOPPED);
    this.task.status = TASK_STATUSES.STOPPED;
  }
};
