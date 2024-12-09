/**
 * @file src/utils/messaging.js
 */
const { listenMessage } = require("@auto-content-labs/messaging");
const { sendSignal, sendMessage } = require("./sendSignal")
const events = require("./events")
module.exports = {
    events,
    sendMessage,
    sendSignal,
    listenMessage,
};
