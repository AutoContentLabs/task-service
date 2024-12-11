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
   * Execute a regular task
   */
  async executeTask() {
    // Logic to execute a single task
    logger.notice(`Executing - ${this.task.headers.correlationId} - ${this.task.type} - ${this.task.name}`);
    const { type, name, _id } = this.task.on_start[0];
    console.log(`on_start:_id`, _id)
    console.log(`on_start:type`, type)
    console.log(`on_start:name`, name)
    // You could add specific code here that actually performs the task logic
    // test
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const { type:typeS, name:nameS, _id:idS } = this.task.on_success[0];
    console.log(`on_success:_id`, idS)
    console.log(`on_success:type`, typeS)
    console.log(`on_success:name`, nameS)
    
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow() {
    // Logic to execute a single task
    logger.notice(`Executing - ${this.task.headers.correlationId} - ${this.task.type} - ${this.task.name}`);

    // You could add specific code here that actually performs the task logic
    // test
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  /**
   * Execute a pipeline
   */
  async executePipeline() {

    // Logic to execute a single task
    logger.notice(`Executing - ${this.task.headers.correlationId} - ${this.task.type} - ${this.task.name}`);

    // You could add specific code here that actually performs the task logic
    // test
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
};
