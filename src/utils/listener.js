/**
 * @file src/utils/messaging.js
 */

const { listenMessage } = require("@auto-content-labs/messaging");

const events = require("./events");

async function listen(callback) {
    return await listenMessage(events.TASKS, callback);
}
module.exports = {
    listen,
};
