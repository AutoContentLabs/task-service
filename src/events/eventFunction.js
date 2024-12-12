/**
 * @file src/events/eventFunction.js
 * @description Event Task
 */
const logger = require("../helpers/logger");
const { sendPair } = require("../utils/sender");
const {
  create,
  update,
  deleteById,
  getById,
  getAll,
  start,
  stop,
  pause,
  resume,
  restart,
  on,
} = require("../services/taskService");
const { TASK_STATES, TASK_STATUSES } = require("../models/mongoModel");
/**
 * Handles request events.
 * @param {Object} pair - The processed data source object.
 * @param {Object} pair.key - The incoming model key.
 * @param {Object} pair.value - The incoming model data.
 * @param {Object} pair.headers - The request headers.
 * @param {Object} pair.headers.correlationId - The correlation ID for tracking.
 */
async function eventFunction(pair) {
  const { key, value, headers } = pair;

  if (!key && !value && !headers) {
    logger.error("No key, value, headers found in the message");
    return;
  }

  try {
    const id = key.recordId;
    const action = key.action;
    const model = value;

    switch (action) {
      case "CREATE":
        create(model);
        break;

      case "UPDATE":
        update(id, model);
        break;

      case "DELETE":
        deleteById(id);
        break;

      case "GET":
        getById(id);
        break;

      case "GET_ALL":
        getAll();
        break;

      case "START":
        start(id);
        break;

      case "STOP":
        stop(id);
        break;

      case "PAUSE":
        pause(id);
        break;

      case "RESUME":
        resume(id);
        break;

      case "RESTART":
        restart(id);
        break;

      default:
        logger.warning("Unknown action request:", action);
        return;
    }

    logger.notice(`action request - ${headers.correlationId} - ${action}`);

    // status already sending in service
    // this is for request
    // for (const status of Object.values(TASK_STATUSES)) {
    //   on(status, (model) => {
    //     // no waiting
    //     // send response for status
    //     sendPair({ key, value: model, headers });
    //   })
    // }

    // state already sending in service
    // this is for engine
    // for (const state of Object.values(TASK_STATES)) {
    //   on(state, (model) => {
    //     // no waiting
    //     // send response for state
    //     sendPair({ key, value: model, headers });
    //   })
    // }
  } catch (error) {
    // Handle errors and send failure response
    const errorMessage = error instanceof Error ? error.message : `${error}`;

    logger.error(
      `action request - ${headers.correlationId} - ${error.name || "Unknown Error"
      }`,
      errorMessage
    );

    throw error; // Error message sent for re-reading.
  }
}

module.exports = { eventFunction };
