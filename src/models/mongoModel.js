/**
 * @file src/models/mongoModel.js
 */
const logger = require("../helpers/logger");
const mongoose = require("mongoose");

const TASK_TYPES = {
    TASK: "TASK",
    WORKFLOW: "WORKFLOW",
    PIPELINE: "PIPELINE",
    DAG: "DAG",
    LINEAR: "LINEAR",
    SERVICE: "SERVICE",
    FUNCTION: "FUNCTION",
    ACTION: "ACTION",
};

const TASK_STATES = {
    IDLE: "IDLE",
    RUNNING: "RUNNING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
    STOPPED: "STOPPED",
    PAUSED: "PAUSED",
    RESTARTED: "RESTARTED",
};

const TASK_STATUSES = {
    IDLE: "IDLE",
    STARTED: "STARTED",
    STOPPED: "STOPPED",
    PAUSED: "PAUSED",
    RESUMED: "RESUMED",
    RESTARTED: "RESTARTED",
};

const ACTION_TYPES = {
    CREATE: "CREATE",
    DELETE: "DELETE",
    UPDATE: "UPDATE",
    GET: "GET",
    GET_ALL: "GET_ALL",

    START: "START",
    START: "START",
    STOP: "STOP",
    PAUSE: "PAUSE",
    RESUME: "RESUME",
    RESTART: "RESTART",
};

// Error log schema
const errorLogSchema = new mongoose.Schema({
    error_message: { type: String, required: true },
    stack_trace: { type: String }, // Added for stack trace
    error_code: { type: String }, // Added for error codes
    timestamp: { type: Date, default: Date.now },
});

// Task schema
const baseTaskSchema = {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    headers: { type: mongoose.Schema.Types.Mixed },
    type: {
        type: String,
        required: true,
        enum: TASK_TYPES,
        default: TASK_TYPES.TASK,
    },
    state: {
        type: String,
        enum: TASK_STATES,
        default: TASK_STATES.IDLE,
    },
    status: {
        type: String,
        enum: TASK_STATUSES,
        default: TASK_STATUSES.IDLE,
    },
    actions: [
        {
            type: {
                type: String,
                enum: ACTION_TYPES,
                required: true,
            },
            timestamp: { type: Date, default: Date.now },
            details: { type: String, required: false },
        },
    ],
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // Dependencies of other tasks
    on_start: [
        {
            type: {
                type: String,
                required: true,
                enum: ["CONFIG", "SERVICE", "TASK", "SCRIPT"],
            },
            name: { type: String, required: true },
            parameters: { type: mongoose.Schema.Types.Mixed },
            input: { type: mongoose.Schema.Types.Mixed },
            output: { type: mongoose.Schema.Types.Mixed },
            timestamp: { type: Date, default: null },
        },
    ],
    on_failure: [
        {
            type: { type: String, required: true, enum: ["FUNCTION", "ROLLBACK"] },
            name: { type: String, required: true },
            timestamp: { type: Date, default: null },
        },
    ],
    on_success: [
        {
            type: {
                type: String,
                required: true,
                enum: ["STATUS", "ACTION", "STEP"],
            },
            name: { type: String, required: true },
            timestamp: { type: Date, default: null },
        },
    ],
    error_log: [errorLogSchema],
    version: { type: Number, default: 1 },
};

// Task schema definition
baseTaskSchema.type.default = TASK_TYPES.TASK;
const taskSchema = new mongoose.Schema(
    {
        ...baseTaskSchema,
    },
    { timestamps: true }
);

// Workflow schema
baseTaskSchema.type.default = TASK_TYPES.WORKFLOW;
const workflowSchema = new mongoose.Schema(
    {
        ...baseTaskSchema,
        steps: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // Referencing tasks instead of embedding them
    },
    { timestamps: true }
);

// Pipeline schema
baseTaskSchema.type.default = TASK_TYPES.PIPELINE;
const pipelineSchema = new mongoose.Schema(
    {
        ...baseTaskSchema,
        steps: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workflow" }], // Referencing workflows instead of embedding them
    },
    { timestamps: true }
);

// Creating the models
const Task = mongoose.model("Task", taskSchema);
const Workflow = mongoose.model("Workflow", workflowSchema);
const Pipeline = mongoose.model("Pipeline", pipelineSchema);

// Callback (Dynamic Function Invoker)
const executeOnFailure = async (failureHook) => {
    try {
        const { type, name } = failureHook;
        if (type === "rollback" && typeof global[name] === "function") {
            await global[name]();
        }
    } catch (err) {
        logger.error("Rollback execution failed:", err.message);
    }
};

module.exports = {
    Task,
    Workflow,
    Pipeline,
    executeOnFailure,
    TASK_TYPES,
    TASK_STATES,
    TASK_STATUSES,
    ACTION_TYPES,
};
