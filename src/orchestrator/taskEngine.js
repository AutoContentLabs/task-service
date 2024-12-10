/**
 * @file src/orchestrator/taskEngine.js
 */
const TaskExecutor = require("./taskExecutor");
const TaskState = require("./taskState");
const { executeOnFailure } = require("../models/mongoModel");

module.exports = class TaskEngine {
  constructor(task) {
    this.task = task;
    this.state = new TaskState(task);
    this.executor = new TaskExecutor(task);
  }

  // TaskEngine start method
  async start() {
    try {
      await this.state.updateState('RUNNING');
      this.task.status = 'STARTED';  // Status: Started
      await this.executor.execute();
      await this.state.updateState('COMPLETED'); // After completion, update state to COMPLETED
    } catch (error) {
      await this.state.updateState('FAILED'); // On failure, state becomes FAILED
      this.task.status = 'STOPPED'; // Task status will be stopped if it fails
      await executeOnFailure(this.task.on_failure[0]);
    }
  }

  async pause() {
    await this.state.updateState('PAUSED');
    this.task.status = 'PAUSED';
  }

  async resume() {
    await this.state.updateState('RUNNING');
    this.task.status = 'RESUMED';
    await this.executor.execute();
  }

  async restart() {
    await this.state.updateState('RESTARTED');
    this.task.status = 'RESTARTED';
    await this.executor.execute();
  }

  async stop() {
    await this.state.updateState('STOPPED');
    this.task.status = 'STOPPED';
  }
}
