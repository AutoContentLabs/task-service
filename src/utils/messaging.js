/**
 * @file src/utils/messaging.js
 */
const { listenMessage } = require("@auto-content-labs/messaging");
const { sendSignal, sendMessage } = require("./sendSignal")
const events = {
    tasks: "tasks",
    task_event: "task_event",
};
module.exports = {
    events,
    sendMessage,
    sendSignal,
    listenMessage,
};
