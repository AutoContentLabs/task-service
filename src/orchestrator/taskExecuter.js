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

    hooker = async (fish) => {
        const { _id, type, name, parameters, input, output } = fish;
        switch (type) {
            case "CONFIG":
                console.log("**  Staring CONFIG...", _id.toString());
                break;

            case "SERVICE":
                console.log("**  Staring SERVICE...", _id.toString());
                break;

            case "SCRIPT":
                if (typeof this.taskLogic[name] === "function") {
                    console.log("💻  Staring SCRIPT...", _id.toString());
                    await this.taskLogic[name](parameters, input, output);
                }
                break;

            case "FUNCTION":
                if (typeof this.taskLogic[name] === "function") {
                    console.log("💻  Staring function...", _id.toString());
                    await this.taskLogic[name](parameters, input, output);
                }
                break;

            case "ROLLBACK":
                console.log("**  Staring ROLLBACK...", _id.toString());
                break;

            case "STATUS":
                console.log("**  Staring STATUS...", _id.toString());
                break;

            case "ACTION":
                console.log("**  Staring ACTION...", _id.toString());
                break;

            case "STEP":
                console.log("**  Staring STEP...", _id.toString());
                break;

            default:
                console.log(`**  Staring ??????${type}...`, _id.toString());
                break;
        }
    };

    executeTask = async (task) => {
        const { id } = task;
        console.log("⚙️  Executing Task...", id.toString());

        try {
            // onStart Hook
            for (const hook of task.on_start) {
                console.log("🪝  Hook on_start...", id.toString());
                this.hooker(hook);
            }

            // onSuccess Hook
            for (const hook of task.on_success) {
                console.log("🪝  Hook on_success...", id.toString());
                this.hooker(hook);
            }
        } catch (error) {
            // on_failure Hook
            for (const hook of task.on_failure) {
                console.log("🪝  Hook on_failure...", id.toString());
                this.hooker(hook);
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
