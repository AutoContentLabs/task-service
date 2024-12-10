/**
 * @file src\orchestrator\taskRegistry.js
 */
module.exports = class TaskRegistry {
  constructor() {
    this.tasks = new Map();
  }

  /**
   *
   * @param {string} taskId
   * @param {Task} task
   */
  registerTask(taskId, task) {
    this.tasks.set(taskId, { ...task, status: "pending" });
  }

  getTask(taskId) {
    return this.tasks.get(taskId);
  }

  updateTaskStatus(taskId, status) {
    if (this.tasks.has(taskId)) {
      this.tasks.get(taskId).status = status;
    }
  }

  updateTaskState(taskId, state) {
    if (this.tasks.has(taskId)) {
      this.tasks.get(taskId).state = state;
    }
  }

  removeTask(taskId) {
    delete getTask(taskId);
  }

  isTaskSuccessful(taskId) {
    const task = getTask(taskId);
    return task && task.state === "COMPLETED";
  }
};
