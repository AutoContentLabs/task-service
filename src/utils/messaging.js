/**
 * @file src/utils/messaging.js
 */
const { sendMessage, listenMessage } = require("@auto-content-labs/messaging");

const events = {
    tasks: "tasks",
    task_event: "task_event",
};
module.exports = {
    events,
    sendMessage,
    listenMessage,
};
