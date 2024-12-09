/**
 * @file src/events/eventFunction.js
 * @description Event Task
 */
const logger = require('../helpers/logger');
const { handleFunction, sendMessage } = require('../utils/messaging');
const taskService = require('../services/taskService');
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
  let response;
  let action = model.action
  let id = model.id
  try {

    switch (action) {
      case 'START':
        response = await taskService.startTask(id)
        break;
      case 'PAUSE':
        response = await taskService.pauseTask(id)
        break;
      case 'STOP':
        response = await taskService.stopTask(id)
        break;
      default:
        console.log('Unknown action:', action);
        return;
    }

    const result = await sendMessage("TASK_EVENT", { value: response, headers: providedHeaders })

  } catch (error) {
    // Handle errors and send failure response
    const errorMessage = error instanceof Error ? error.message : `${error}`;

    logger.error(`[ds] ${headers.correlationId} - ${error.name || "Unknown Error"}`, errorMessage);

    throw error; // Error message sent for re-reading.
  }

}

module.exports = { eventFunction };
