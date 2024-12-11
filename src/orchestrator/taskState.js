/**
 * @file src/orchestrator/taskState.js
 */

const logger = require("../helpers/logger");
module.exports = class TaskState {
  /**
   * @param {Object} task - Task object
   */
  constructor(task) {
    this.task = task;
  }

  /**
   * Update the state of the task
   * @param {String} newState - The new state (e.g., 'RUNNING', 'COMPLETED', etc.)
   */
  async updateState(newState) {
    this.task.state = newState;
    logger.info(`Task ${this.task.name} is now in state: ${newState}`);
    if (typeof this.task.save === 'function') {
      await this.task.save();
    }
  }
};
