const EventEmitter = require("events");

class TaskEngine extends EventEmitter {
    constructor() {
        super();
        this.tasks = new Map(); // Tüm görevler
        this.runningTasks = new Set(); // Çalışan görevler
    }

    // 📌 Create Task
    createTask(task) {
        if (!task.id) throw new Error("Task must have an id");
        task.status = "PENDING";
        task.attempts = 0;
        task.priority = task.priority || 0;
        this.tasks.set(task.id, task);
        console.log(`🟢 Task [${task.id}] created`);
        return task;
    }

    // 📌 Update Task
    updateTask(taskId, updates) {
        const task = this.tasks.get(taskId);
        if (!task) throw new Error(`Task [${taskId}] not found`);
        Object.assign(task, updates);
        console.log(`🟡 Task [${taskId}] updated`);
        return task;
    }

    // 📌 Delete Task
    deleteTask(taskId) {
        if (this.tasks.delete(taskId)) {
            console.log(`🗑️ Task [${taskId}] deleted`);
        } else {
            console.warn(`Task [${taskId}] not found`);
        }
    }

    // 📌 Start Tasks
    start() {
        this.runAvailableTasks();
    }

    // 📌 Run Available Tasks
    runAvailableTasks() {
        const availableTasks = Array.from(this.tasks.values())
            .filter((task) => task.status === "PENDING" && this.canRunTask(task))
            .sort((a, b) => b.priority - a.priority);

        availableTasks.forEach((task) => this.runTask(task));
    }

    // 📌 Check if task can run
    canRunTask(task) {
        if (!task.dependencies || task.dependencies.length === 0) return true;

        return task.dependencies.every((depId) => {
            const depTask = this.tasks.get(depId);

            return depTask && depTask.status === "SUCCESS";
        });
    }

    // 📌 Run a task
    runTask(task) {
        if (task.status !== "PENDING") return;
        task.status = "RUNNING";
        this.runningTasks.add(task.id);
        console.log(`🔷 Task [${task.id}] ${task.name}]is RUNNING...`);

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
        task.status = "SUCCESS";
        this.runningTasks.delete(task.id);
        console.log(`✅ Task [${task.id}] is SUCCESS`);
        this.emit("taskSuccess", task);
        this.runAvailableTasks();
    }

    // 📌 Fail Task
    failTask(task) {
        task.attempts++;
        if (task.attempts >= task.maxAttempts) {
            task.status = "FAILED";
            this.emit("taskFailed", task);
        } else {
            console.log(`🔁 Retrying Task [${task.id}]...`);
            setTimeout(() => {
                task.status = "PENDING";
                this.runTask(task);
            }, 2000);
        }
    }

    // 📌 Stop Task
    stopTask(taskId) {
        const task = this.tasks.get(taskId);
        if (task && task.status === "RUNNING") {
            task.status = "STOPPED";
            console.log(`⏹️ Task [${taskId}] stopped`);
        }
    }

    // 📌 Pause Task
    pauseTask(taskId) {
        const task = this.tasks.get(taskId);
        if (task && task.status === "RUNNING") {
            task.status = "PAUSED";
            console.log(`⏸️ Task [${taskId}] paused`);
        }
    }

    // 📌 Resume Task
    resumeTask(taskId) {
        const task = this.tasks.get(taskId);
        if (task && task.status === "PAUSED") {
            task.status = "RUNNING";
            console.log(`▶️ Task [${taskId}] resumed`);
            this.runTask(task);
        }
    }

    // 📌 Restart Task
    restartTask(taskId) {
        const task = this.tasks.get(taskId);
        if (task) {
            task.status = "PENDING";
            task.attempts = 0;
            console.log(`🔄 Task [${taskId}] restarted`);
            this.runTask(task);
        }
    }

    // 📌 Cancel Task
    cancelTask(taskId) {
        const task = this.tasks.get(taskId);
        if (task && task.status === "RUNNING") {
            task.status = "CANCELLED";
            this.runningTasks.delete(task.id);
            console.log(`🚫 Task [${taskId}] cancelled`);
            this.emit("taskCancelled", task);
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
