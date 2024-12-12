// sendSignal.js

const { sendMessage } = require("@auto-content-labs/messaging");
const events = require("./events");
const logger = require("../helpers/logger");

/**
 *
 * @param {Object} model -
 * @param {Object} model.headers -
 * @param {Object} model._id -
 * @param {string} model.status -
 * @param {string} model.state -
 * @param {Object} model -
 *
 * @returns {Promise} -
 */
const sendModel = async (model) => {
    try {
        const headers = JSON.parse(JSON.stringify(model.headers));
        const recordId = model._id;
        const status = model.status;
        const state = model.state;
        const value = JSON.parse(JSON.stringify(model));

        const messageStatus = await sendMessage(events.TASK_EVENT, {
            key: { recordId, status, state },
            value,
            headers,
        });

        logger.info(messageStatus);
    } catch (error) {
        console.error("Error sending signal:", error);
    }
};

const sendPair = async (pair) => {
    const { key, value, headers } = pair;
    try {
        return await sendMessage(events.TASK_EVENT, {
            key,
            value,
            headers,
        }).then((response) => {
            logger.info("sended pair", response);
        });
    } catch (error) {
        console.error("Error sending pair:", error);
    }
};

module.exports = { sendModel, sendPair, sendMessage };
