/**
 * @file src/models/mongoModel.js
 */
const mongoose = require('mongoose');

// Error log schema
const errorLogSchema = new mongoose.Schema({
    error_message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Task schema
const task = {
    name: { type: String, required: true, unique: true }, // Task name (unique)
    description: { type: String, required: false }, // Task description
    headers: { type: mongoose.Schema.Types.Mixed }, // correlationId  traceId type(schemaType) for service tracing
    type: {
        type: String,
        required: true,
        enum: ['PIPELINE', 'DAG', 'LINEAR', 'TASK', 'SERVICE', 'FUNCTION', 'WORKFLOW', 'ACTION'],
        default: 'TASK'
    },
    state: {
        type: String,
        enum: ['IDLE', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'],
        default: 'IDLE'
    },
    status: {
        type: String,
        enum: ['IDLE', 'IN_PROGRESS',
            'STARTED', 'STOPPED', 'PAUSED', 'RESUMED', 'RESTARTED',],
        default: 'IDLE'
    },
    actions: [{
        type: {
            type: String,
            enum: [
                'CREATE', 'DELETE', 'UPDATE', 'GET', 'GET_ALL',
                'START', 'STOP', 'PAUSE', 'RESUME', 'RESTART'
            ],
            required: true
        },
        timestamp: { type: Date, default: Date.now },
        details: { type: String, required: false }
    }],
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // Dependencies of other tasks
    on_start: [{
        type: { type: String, required: true, enum: ['CONFIG', 'SERVICE', 'TASK', 'SCRIPT'] },
        name: { type: String, required: true },
        parameters: { type: mongoose.Schema.Types.Mixed },
        input: { type: mongoose.Schema.Types.Mixed },
        output: { type: mongoose.Schema.Types.Mixed },
        timestamp: { type: Date, default: null }
    }],
    on_failure: [{
        type: { type: String, required: true, enum: ['FUNCTION', 'ROLLBACK'] },
        name: { type: String, required: true },
        timestamp: { type: Date, default: null }
    }],
    on_success: [{
        type: { type: String, required: true, enum: ['STATUS', 'ACTION', 'STEP'] },
        name: { type: String, required: true },
        timestamp: { type: Date, default: null }
    }],
    error_log: [errorLogSchema], // Error log (can contain multiple error records)
    version: { type: Number, default: 1 } // Version control
}

// Task schema definition
task.type.default = "TASK"
const taskSchema = new mongoose.Schema({
    ...task
}, { timestamps: true });

// Workflow schema
task.type.default = "WORKFLOW"
const workflowSchema = new mongoose.Schema({
    ...task,
    steps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] // Referencing tasks instead of embedding them
}, { timestamps: true });


// Pipeline schema
task.type.default = "PIPELINE"
const pipelineSchema = new mongoose.Schema({
    ...task,
    steps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workflow' }] // Referencing workflows instead of embedding them
}, { timestamps: true });

// Creating the models
const Task = mongoose.model('Task', taskSchema);
const Workflow = mongoose.model('Workflow', workflowSchema);
const Pipeline = mongoose.model('Pipeline', pipelineSchema);

// Callback (Dynamic Function Invoker)
const executeOnFailure = async (failureHook) => {
    try {
        const { type, name } = failureHook;
        if (type === 'rollback' && typeof global[name] === 'function') {
            await global[name]();
        }
    } catch (err) {
        console.error('Rollback execution failed:', err.message);
    }
};

module.exports = { Task, Workflow, Pipeline, executeOnFailure }
