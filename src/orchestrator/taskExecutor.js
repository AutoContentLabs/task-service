/**
 * @file src/orchestrator/taskExecutor.js
 */
const logger = require("../helpers/logger")
const { TASK_TYPES } = require("../models/mongoModel");
module.exports = class TaskExecutor {
  /**
   * @param {Object} task - The task object to be executed
   */
  constructor(task) {
    this.task = task;
  }

  /**
   * Execute the task logic based on its type
   */
  async execute() {
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
  }

  /**
   * Execute a regular task
   */
  async executeTask() {
    // test
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Logic to execute a single task
    logger.notice(`Executing - ${this.task.headers.correlationId} - ${this.task.type} - ${this.task.name}`);
    // You could add specific code here that actually performs the task logic
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow() {
    // test
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`Executing workflow: ${this.task.name}`);
    // Execute all tasks in the workflow in sequence or based on their dependencies
  }

  /**
   * Execute a pipeline
   */
  async executePipeline() {
    // test
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`Executing pipeline: ${this.task.name}`);
    // Execute workflows sequentially or in parallel, depending on the pipeline configuration
  }
};
