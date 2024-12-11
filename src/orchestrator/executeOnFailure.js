// src\orchestrator\executeOnFailure.js
const logger = require("../helpers/logger")

global.rollbackFunction1 = async function () {
    try {

        logger.info("Rollback initiated: Reverting database changes...");

    } catch (err) {
        logger.error("Rollback failed:", err.message);
    }
};


global.rollbackFunction2 = async function () {
    try {
        logger.info("Rollback initiated: Restoring deleted files...");

    } catch (err) {
        logger.error("File rollback failed:", err.message);
    }
};


global.startService = async function () {
    try {
        logger.info("Starting service...");

    } catch (err) {
        logger.error("Service start failed:", err.message);
    }
};


global.sendNotification = async function () {
    try {
        logger.info("Sending notification...");

    } catch (err) {
        logger.error("Notification failed:", err.message);
    }
};

global.handleTaskFailure = async function () {
    try {
        logger.notice("Starting task failure...");

    } catch (err) {
        logger.error("Task Failure failed:", err.message);
    }
};


// Secure
const allowedFunctions = {
    "handleTaskFailure": true,
};

module.exports = async (failureHook) => {
    try {
        const { type, name } = failureHook;

        if (type === "ROLLBACK" && allowedFunctions[name]) {
            if (typeof global[name] === "function") {
                await global[name]();
                logger.info(`Rollback function '${name}' executed successfully.`);
            } else {
                logger.warning(`Rollback function '${name}' not found in global scope.`);
            }
        }

        else if (type === "FUNCTION" && allowedFunctions[name]) {
            if (typeof global[name] === "function") {
                await global[name]();
                logger.info(`Function '${name}' executed successfully.`);
            } else {
                logger.warning(`Function '${name}' not found in global scope.`);
            }
        } else {
            logger.warning(`Unauthorized or unsupported failure hook type: ${type}`);
        }
    } catch (err) {
        logger.error("Execution failed:", err.message);
    }
};
