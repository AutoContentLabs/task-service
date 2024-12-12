// src\services\fn.js
/**
 * @file src/services/fn.js
 * @description function
 */

const logger = require("../helpers/logger");

const { listen } = require("../utils/listener");

const { eventFunction } = require("../events/eventFunction");

const async = require("async");
// Get the concurrent parallel limit from the environment variable, default to 5 if not set
const MAX_PARALLEL_TASKS = parseInt(process.env.MAX_PARALLEL_TASKS) || 5;

global.tasksProcessed = 0;
global.startTime = null;

// Start the listener for data collection requests
async function start() {
  try {
    logger.info("Application starting...");

    // Start time for overall processing
    global.startTime = Date.now();

    // Listen to incoming data source requests
    await listen(eventFunction);

    logger.info(`Listener started`);
  } catch (error) {
    logger.error(`Application failed`, error);
  }
}

/**
 * Graceful shutdown handler for the application.
 */
function handleShutdown() {
  logger.info("Application shutting down...");
  process.exit(0);
}

// Listen for process signals for graceful shutdown
process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

module.exports = { start };
