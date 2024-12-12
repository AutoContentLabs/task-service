/**
 * @file src\orchestrator\taskLogic.js
 */
const EventEmitter = require("events");
module.exports = class TaskLogic extends EventEmitter {
    constructor() {
        super();

        if (TaskLogic.instance) {
            return TaskLogic.instance;
        }

        TaskLogic.instance = this;
    }

    handleTaskFailure = async () => { };
    handleWorkflowFailure = async () => { };
    handlePipelineFailure = async () => { };
    service = async () => { };
    step = async () => { };
    config = async () => { };
    status = async () => { };
    do = async (parameters, input, output) => {
        console.log("🔢  Parameters...", parameters);
        console.log("⬇️  Input", input);
        console.log("⬆️  Output", output);
    };
};
