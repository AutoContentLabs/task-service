/**
 * @file src\orchestrator\taskRegistry.js
 */
module.exports = class TaskRegistry {
  constructor() {
    this.tasks = new Map();
  }

  /**
   *
   * @param {string} id
   * @param {Task} model
   */
  registerTask(id, model) {
    this.tasks.set(id, { ...model, status: "IDLE" });
  }

  getTask(id) {
    return this.tasks.get(id);
  }

  updateTaskStatus(id, status) {
    if (this.tasks.has(id)) {
      this.tasks.get(id).status = status;
    }
  }

  updateTaskState(id, state) {
    if (this.tasks.has(id)) {
      this.tasks.get(id).state = state;
    }
  }

  removeTask(id) {
    this.tasks.delete(id);
  }

  isTaskSuccessful(id) {
    const task = getTask(id);
    return task && task.state === "COMPLETED";
  }
};
