/**
 * @file src/orchestrator/taskState.js
 */
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
    // You could also add more logic here to handle any side effects (like logging or sending notifications)
    console.log(`Task ${this.task.name} is now ${newState}`);
    // For example, you can also update the database here if required
    await this.task.save(); // This will update the task in MongoDB
  }
}
