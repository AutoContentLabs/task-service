const EventEmitter = require("events");
const { TASK_STATES } = require("../models/mongoModel");
class TaskEngine extends EventEmitter {
    constructor() {
        super();
        this.tasks = new Map();
        this.runningTasks = new Set();
    }

    // 📌 Create Task
    createTask(task) {
        if (!task.id) throw new Error("Task must have an id");
        task.status = TASK_STATES.WAITING;
        task.attempts = 0;
        task.priority = task.priority || 0;
        this.tasks.set(task.id, task);
        console.log(`🟢 Task [${task.id}] ${task.name} created`);
        return task;
    }

    // 📌 Update Task
    updateTask(taskId, updates) {
        const task = this.tasks.get(taskId);
        if (!task) throw new Error(`Task [${taskId}] ${task.name} not found`);
        Object.assign(task, updates);
        console.log(`🟡 Task [${taskId}] updated`);
        return task;
    }

    // 📌 Delete Task
    deleteTask(taskId) {
        if (this.tasks.delete(taskId)) {
            console.log(`🗑️ Task [${taskId}] ${task.name} deleted`);
        } else {
            console.warn(`Task [${taskId}] ${task.name} not found`);
        }
    }

    // 📌 Start Tasks
    start() {
        this.runAvailableTasks();
    }

    // 📌 Run Available Tasks
    runAvailableTasks() {
        const availableTasks = Array.from(this.tasks.values())
            .filter(
                (task) => task.status === TASK_STATES.WAITING && this.canRunTask(task)
            )
            .sort((a, b) => b.priority - a.priority);

        availableTasks.forEach((task) => this.runTask(task));
    }

    // 📌 Check if task can run
    canRunTask(task) {
        if (!task.dependencies || task.dependencies.length === 0) return true;

        return task.dependencies.every((depId) => {
            const depTask = this.tasks.get(depId);

            return depTask && depTask.status === TASK_STATES.COMPLETED;
        });
    }

    // 📌 Run a task
    runTask(task) {
        if (task.status !== TASK_STATES.WAITING) return;
        task.status = TASK_STATES.RUNNING;
        this.runningTasks.add(task.id);
        console.log(`🔷 Task [${task.id}] ${task.name}] is RUNNING...`);

        setTimeout(() => {
            const isSuccess = Math.random() > 0.3;
            if (isSuccess) {
                this.completeTask(task);
            } else {
                this.failTask(task);
            }
        }, task.duration || 1000);
    }

    // 📌 Complete Task
    completeTask(task) {
        task.status = TASK_STATES.COMPLETED;
        this.runningTasks.delete(task.id);
        console.log(`✅ Task [${task.id}] ${task.name} is SUCCESS`);
        this.emit(TASK_STATES.COMPLETED, task);
        this.runAvailableTasks();
    }

    // 📌 Fail Task
    failTask(task) {
        task.attempts++;
        if (task.attempts >= task.maxAttempts) {
            task.status = TASK_STATES.FAILED;
            this.emit(TASK_STATES.FAILED, task);
        } else {
            console.log(`🔁 Retrying Task [${task.id}] ${task.name}...`);
            setTimeout(() => {
                task.status = TASK_STATES.WAITING;
                this.runTask(task);
            }, 2000);
        }
    }

    // 📌 Stop Task
    stopTask(taskId) {
        const task = this.tasks.get(taskId);
        if (task && task.status === TASK_STATES.RUNNING) {
            task.status = TASK_STATES.STOPPED;
            console.log(`⏹️ Task [${taskId}] ${task.name} stopped`);
        }
    }

    // 📌 Pause Task
    pauseTask(taskId) {
        const task = this.tasks.get(taskId);
        if (task && task.status === TASK_STATES.RUNNING) {
            task.status = TASK_STATES.PAUSED;
            console.log(`⏸️ Task [${taskId}] ${task.name} paused`);
        }
    }

    // 📌 Resume Task
    resumeTask(taskId) {
        const task = this.tasks.get(taskId);
        if (task && task.status === TASK_STATES.PAUSED) {
            task.status = TASK_STATES.RUNNING;
            console.log(`▶️ Task [${taskId}] ${task.name} resumed`);
            this.runTask(task);
        }
    }

    // 📌 Restart Task
    restartTask(taskId) {
        const task = this.tasks.get(taskId);
        if (task) {
            task.status = TASK_STATES.WAITING;
            task.attempts = 0;
            console.log(`🔄 Task [${taskId}] ${task.name} restarted`);
            this.runTask(task);
        }
    }

    // 📌 Cancel Task
    cancelTask(taskId) {
        const task = this.tasks.get(taskId);
        if (task && task.status === TASK_STATES.RUNNING) {
            task.status = TASK_STATES.CANCELLED;
            this.runningTasks.delete(task.id);
            console.log(`🚫 Task [${taskId}] ${task.name} cancelled`);
            this.emit(TASK_STATES.CANCELLED, task);
        }
    }

    // 📌 Show All Tasks
    showTasks() {
        console.table(
            Array.from(this.tasks.values()).map((task) => ({
                id: task.id,
                name: task.name,
                status: task.status,
                attempts: task.attempts,
                priority: task.priority,
            }))
        );
    }
}

module.exports = TaskEngine;
