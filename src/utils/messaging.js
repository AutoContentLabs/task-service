/**
 * @file src/utils/messaging.js
 */
const { sendMessage, listenMessage } = require('@auto-content-labs/messaging');
const { helper } = require('@auto-content-labs/messaging-utils');
const logger = require('../helpers/logger');


async function listen(event, callback) {
    listenMessage(event, callback)
}

// Send Message Function with Error Handling and Logging
async function send(event, providedPair) {
    const headers = providedPair.headers || helper.generateHeaders(event);
    const key = providedPair.key || helper.generateKey();
    const value = providedPair.value
    const pair = {
        value,
        key,
        headers
    };

    try {
        logger.info(`Sending message for event: ${event} with key: ${JSON.stringify(key)}`);
        const response = await sendMessage(event, pair);

        // Logging success
        logger.info(`Message sent successfully for event: ${event}, key: ${JSON.stringify(key)}`);

        return response;
    } catch (error) {
        // Logging error with detailed message
        logger.error(`Error sending message for event: ${event} with key: ${key}: ${error.message}`);
        throw new Error(`Failed to send message for event: ${event}`);
    }
}
async function sendResponse({ key, value, headers }) {
    const result = await sendMessage(events.task_event, { key, value, headers })
    return result;
}
async function handleFunction({ key, value, headers }) {
    return value
}
const events = {
    tasks: "tasks",
    task_event: "task_event"
}
module.exports = {
    events,
    sendMessage: send,
    sendResponse,
    listenMessage: listen,
    handleFunction
};
