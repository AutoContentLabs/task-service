/**
 * @file src/events/eventTask.js
 * @description Event Task
 */
const logger = require('../helpers/logger');
const { sendResponse, handleFunction } = require('../utils/messaging');

/**
 * Handles request events.
 * @param {Object} pair - The processed data source object.
 * @param {Object} pair.key - The incoming model key.
 * @param {Object} pair.value - The incoming model data.
 * @param {Object} pair.headers - The request headers.
 * @param {Object} pair.headers.correlationId - The correlation ID for tracking.
 */
async function eventFunction(pair) {
  const { key, value, headers } = pair
  if (!value) {
    logger.error("No value found in the message");
    return;
  }

  // prepare the model to be used
  const model = await handleFunction({ key, value, headers });
  // prepare the title to be moved  
  const providedHeaders = { correlationId: headers.correlationId, traceId: headers.traceId } // track before request

  try {
    const response = { "status":"ok"}
    // Send the successful response
    await sendResponse({ value: response, headers: providedHeaders });

  } catch (error) {
    // Handle errors and send failure response
    const errorMessage = error instanceof Error ? error.message : `${error}`;

    logger.error(`[ds] ${headers.correlationId} - ${error.name || "Unknown Error"}`, errorMessage);

    throw error; // Error message sent for re-reading.
  }

}

module.exports = { eventFunction };
