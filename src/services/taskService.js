// src\services\taskService.js
const { generateHeaders } = require('@auto-content-labs/messaging-utils/src/helpers/helper');
const { TaskEngine } = require('../orchestrator');
const taskRepository = require('../repositories/taskRepository');

class TaskService {
    async create(model) {
        // correlationId  traceId type(schemaType) for service tracing
        model.headers = generateHeaders("Task")
        return await taskRepository.create(model);
    }

    async update(id, model) {
        return await taskRepository.update(id, model);
    }

    async deleteById(id) {
        return await taskRepository.deleteById(id);
    }

    async getById(id) {
        return await taskRepository.getById(id);
    }

    async getAll() {
        return await taskRepository.getAll();
    }

    async start(id) {

        const model = await this.getById(id);
        if (!model) {
            return null
        }

        model.status = 'STARTED';

        model.actions.push({
            type: 'START',
            timestamp: new Date(),
            details: 'started via API'
        });

        const result = this.update(id, model)

        // Task Engine
        new TaskEngine(model)

        return result;
    }

    async stop(id) {

        const model = await this.getById(id);
        if (!model) {
            return null
        }

        model.status = 'STOPPED';

        model.actions.push({
            type: 'STOP',
            timestamp: new Date(),
            details: 'stopped via API'
        });

        const result = this.update(id, model)

        return result;
    }
    async pause(id) {

        const model = await this.getById(id);
        if (!model) {
            return null
        }

        model.status = 'PAUSED';

        model.actions.push({
            type: 'PAUSE',
            timestamp: new Date(),
            details: 'paused via API'
        });

        const result = this.update(id, model)

        return result;
    }

    async resume(id) {
        const model = await this.getById(id);
        if (!model) {
            return null
        }

        model.status = 'RESUMED';

        model.actions.push({
            type: 'RESUME',
            timestamp: new Date(),
            details: 'resumed via API'
        });

        const result = this.update(id, model)

        return result;
    }

    async restart(id) {
        const model = await this.getById(id);
        if (!model) {
            return null
        }

        model.status = 'RESTARTED';

        model.actions.push({
            type: 'RESTART',
            timestamp: new Date(),
            details: 'Task resumed via API'
        });

        const result = this.update(id, model)

        return result;
    }

}

module.exports = new TaskService();
