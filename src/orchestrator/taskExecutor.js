/**
 * @file src/orchestrator/taskExecutor.js
 */
const logger = require("../helpers/logger");
const { TASK_TYPES } = require("../models/mongoModel");
module.exports = class TaskExecutor {
  /**
   * @param {Object} task - The task object to be executed
   */
  constructor(task, taskRepository) {
    this.task = task;
    this.taskRepository = taskRepository;
  }

  /**
   * Execute the task logic based on its type
   */
  async execute() {
    try {
      switch (this.task.type) {
        case TASK_TYPES.TASK:
          await this.executeTask();
          break;
        case TASK_TYPES.WORKFLOW:
          await this.executeWorkflow();
          break;
        case TASK_TYPES.PIPELINE:
          await this.executePipeline();
          break;
        default:
          throw new Error(`Unsupported task type: ${this.task.type}`);
      }
    } catch (error) {
      throw new Error(`Task execution failed: ${error.message}`);
    }
  }

  /**
   * Execute a regular task with dependency control
   */
  async executeTask() {
    // 1. Öncelikle dependencies kontrol ediliyor
    for (const dependency of this.task.dependencies) {

      const { name, type, _id } = dependency
      logger.info(`executeTask : Checking dependency - ${type} - ${name} - ${_id}`);

      if (!dependency) {
        throw new Error(`Dependency task with id ${_id} not found.`);
      }

      if (dependency.state !== "COMPLETED") {
        logger.info(`Waiting for dependency - ${type} - ${name} - ${_id}`);
        while (dependency.state !== "COMPLETED") {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 saniyede bir kontrol
        }
      }
    }

    // 2. onStart Hook'u çalıştırılıyor
    for (const hook of this.task.on_start) {
      const { type, name, _id } = hook;
      logger.info(`Executing onStart hook - ${type} - ${name} - ${_id}`);
      if (typeof global[name] === "function") {
        await global[name]();
      }
    }

    // 3. Task Logic
    logger.notice(
      `Executing - ${this.task.headers.correlationId} - ${this.task.type} - ${this.task.name}`
    );
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 saniye bekleme

    // 4. onSuccess Hook'u çalıştırılıyor
    for (const hook of this.task.on_success) {
      const { type, name, _id } = hook;
      logger.info(`Executing onSuccess hook - ${type} - ${name} - ${_id}`);
      if (typeof global[name] === "function") {
        await global[name]();
      }
    }
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow() {
    // Logic to execute a single task
    logger.notice(
      `Executing - ${this.task.headers.correlationId} - ${this.task.type} - ${this.task.name}`
    );

    // You could add specific code here that actually performs the task logic
    // test
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  /**
   * Execute a pipeline
   */
  async executePipeline() {
    // Logic to execute a single task
    logger.notice(
      `Executing - ${this.task.headers.correlationId} - ${this.task.type} - ${this.task.name}`
    );

    // You could add specific code here that actually performs the task logic
    // test
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
};
