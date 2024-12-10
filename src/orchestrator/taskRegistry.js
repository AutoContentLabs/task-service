/**
 * centralized task management
 * @file src\orchestrator\taskRegistry.js
 */
module.exports = class TaskRegistry {
  constructor() {
    // centralized tasks
    this.tasks = new Map();
  }

  registerTask(id, model) {
    this.tasks.set(id, model);
  }

  updateTask(id, updateModel) {
    if (this.tasks.has(id)) {
      const existingTask = this.tasks.get(id);
      this.tasks.set(taskId, { ...existingTask, ...updateModel });
    }
  }

  getTask(id) {
    return this.tasks.get(id);
  }

  removeTask(id) {
    this.tasks.delete(id);
  }
}
