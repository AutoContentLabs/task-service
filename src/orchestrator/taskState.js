class State {
  static IDLE = 'IDLE';
  static PENDING = 'PENDING';
  static RUNNING = 'RUNNING';
  static COMPLETED = 'COMPLETED';
  static FAILED = 'FAILED';
  static RETRYING = 'RETRYING';
}
module.exports = class TaskState {
  constructor() {
    this.states = new Map();
  }

  setState(taskId, state) {
    this.states.set(taskId, state);
  }

  getState(taskId) {
    return this.states.get(taskId);
  }

  deleteState(taskId) {
    this.states.delete(taskId);
  }
}
