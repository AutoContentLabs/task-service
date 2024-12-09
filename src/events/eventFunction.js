/**
 * @file src/events/eventFunction.js
 * @description Event Task
 */
const logger = require('../helpers/logger');
const { handleFunction, sendMessage } = require('../utils/messaging');
const { create, update, deleteById, getById, getAll, start, stop, pause, resume, restart } = require('../services/taskService');
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
      case 'CREATE':
        response = await create(model)
        break;

      case 'UPDATE':
        response = await update(id, model)
        break;
      case 'DELETE':
        response = await deleteById(id)
        break;
      case 'GET':
        response = await getById(id)
        break;
      case 'GET_ALL':
        response = await getAll()
        break;
        
      case 'START':
        response = await start(id)
        break;
      case 'STOP':
        response = await stop(id)
        break;
      case 'PAUSE':
        response = await pause(id)
        break;
      case 'RESUME':
        response = await resume(id)
        break;
      case 'RESTART':
        response = await restart(id)
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
