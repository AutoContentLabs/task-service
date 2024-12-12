/**
 * @file src/orchestrator/taskExecutor.js
 */
const TaskLogic = require("./taskLogic");
const EventEmitter = require("events");
const { TASK_TYPES } = require("../models/mongoModel");
module.exports = class TaskExecutor extends EventEmitter {
    constructor() {
        super();

        if (TaskExecutor.instance) {
            return TaskExecutor.instance;
        }

        TaskExecutor.instance = this;
        this.taskLogic = new TaskLogic();
    }

    execute = async (task) => {
        try {
            switch (task.type) {
                case TASK_TYPES.TASK:
                    await this.executeTask(task);
                    break;
                case TASK_TYPES.WORKFLOW:
                    await this.executeWorkflow(task);
                    break;
                case TASK_TYPES.PIPELINE:
                    await this.executePipeline(task);
                    break;
                default:
                    throw new Error(`Unsupported task type: ${task.type}`);
            }
        } catch (error) {
            throw new Error(`Task execution failed: ${error.message}`);
        }
    };

    hook = async (item) => {
        const { _id, type, name, parameters, input, output } = item;
        if (type === "function") {
            if (typeof this.taskLogic[name] === "function") {
                console.log("💻  Staring function...", id.toString());
                await this.taskLogic[name](parameters, input, output);
            }
        }
    };

    executeTask = async (task) => {
        const { id } = task;
        console.log("⚙️  Executing Task...", id.toString());

        try {
            // onStart Hook
            for (const hook of task.on_start) {
                console.log("🪝  Hook on_start...", id.toString());
                hook(hook);
            }

            // onSuccess Hook
            for (const hook of task.on_success) {
                console.log("🪝  Hook on_success...", id.toString());
                hook(hook);
            }
        } catch (error) {
            // on_failure Hook
            for (const hook of task.on_failure) {
                console.log("🪝  Hook on_failure...", id.toString());
                hook(hook);
            }
        }
    };

    executeWorkflow = async (task) => {
        const { id } = task;
        console.log("⚙️  Executing Workflow...", id.toString());
    };

    executePipeline = async (task) => {
        const { id } = task;
        console.log("⚙️  Executing Pipeline...", id.toString());
    };
};
