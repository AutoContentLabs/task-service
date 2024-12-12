const apiUrl = "http://localhost:53100/api/tasks"; // API URL

// Create Task
const createTaskForm = document.getElementById("createTaskForm");
createTaskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const taskName = document.getElementById("taskName").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const selectedDependencies = Array.from(
        document.getElementById("taskDependencies").options
    )
        .filter((option) => option.selected)
        .map((option) => option.value);

    const task = {
        name: taskName,
        description: taskDescription,
        type: TASK_TYPES.TASK, // Default to task type
        state: TASK_STATES.IDLE, // Default to idle state
        status: TASK_STATUSES.IDLE, // Default to idle status
        dependencies: selectedDependencies, // Add selected dependencies
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
        });

        const data = await response.json();
        if (response.ok) {
            getTasks(); // Refresh the task list
            fillTaskDependencies(); // Refresh the dependencies list
        } else {
            console.error("Error creating task:", data);
        }
    } catch (error) {
        console.error("Error creating task:", error);
    }
});

// Delete Task
const deleteTask = async (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
        try {
            const response = await fetch(`${apiUrl}/${taskId}`, {
                method: "DELETE",
            });

            if (response.status === 204) {
                alert("Task deleted successfully.");
                getTasks();
                fillTaskDependencies(); // Refresh the dependencies list
            } else {
                const data = await response.json();
                alert("Error: " + data.error);
            }
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Error deleting task: " + error.message);
        }
    }
};

// Get Tasks
const getTasks = async () => {
    try {
        const response = await fetch(apiUrl);
        const tasks = await response.json();
        const taskList = document.getElementById("taskList");
        taskList.innerHTML = ""; // Clear the list

        tasks.forEach((task) => {
            const listItem = document.createElement("li");
            let taskClass = "";
            let startDisabled = false;
            let pauseDisabled = false;
            let stopDisabled = false;
            let resumeDisabled = false;

            // Handle task state and status
            if (task.state === TASK_STATES.RUNNING) {
                taskClass = "task-in-progress";
                startDisabled = true;
                stopDisabled = false;
                pauseDisabled = false;
                resumeDisabled = true;
            } else if (task.state === TASK_STATES.PAUSED) {
                taskClass = "task-paused";
                startDisabled = true;
                stopDisabled = false;
                pauseDisabled = true;
                resumeDisabled = false;
            } else if (task.state === TASK_STATES.COMPLETED) {
                taskClass = "task-completed";
                startDisabled = true;
                stopDisabled = true;
                pauseDisabled = true;
                resumeDisabled = true;
            } else if (task.state === TASK_STATES.STOPPED) {
                taskClass = "task-stopped";
                startDisabled = false;
                stopDisabled = true;
                pauseDisabled = true;
                resumeDisabled = false;
            }

            listItem.className = taskClass;
            listItem.innerHTML = `
                <strong class="name">${task.name}</strong>
                <strong class="state">${task.state}</strong>
                <strong class="status">${task.status}</strong>
                <div class="actions-container">
                    <button onclick="startTask('${task._id}')" ${startDisabled ? "disabled" : ""
                }>Start</button>
                    <button onclick="pauseTask('${task._id}')" ${pauseDisabled ? "disabled" : ""
                }>Pause</button>
                    <button onclick="stopTask('${task._id}')" ${stopDisabled ? "disabled" : ""
                }>Stop</button>
                    <button onclick="resumeTask('${task._id}')" ${resumeDisabled ? "disabled" : ""
                }>Resume</button>
                    <button onclick="restartTask('${task._id
                }')">Restart</button>
                    <button onclick="deleteTask('${task._id
                }')" class="delete-btn">Delete</button>
                </div>
            `;
            taskList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
};

// Generalized function to check task status periodically
const checkTaskStatus = async (taskId) => {
    let checkCount = 0;
    const interval = setInterval(async () => {
        checkCount++;
        const taskResponse = await fetch(`${apiUrl}/${taskId}`);
        const task = await taskResponse.json();

        if (task.status === TASK_STATUSES.COMPLETED || checkCount >= 10) {
            clearInterval(interval); // Stop checking after completion or 10 attempts
            getTasks(); // Refresh the task list after task completion
        }
    }, 5000); // Check every 5 seconds
};

// Start Task
const startTask = async (taskId) => {
    try {
        const response = await fetch(`${apiUrl}/${taskId}/start`, {
            method: "POST",
        });
        const data = await response.json();
        if (response.ok) {
            getTasks(); // Refresh the task list immediately
            await checkTaskStatus(taskId); // Check task status periodically
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error starting task:", error);
    }
};

// Stop Task
const stopTask = async (taskId) => {
    try {
        const response = await fetch(`${apiUrl}/${taskId}/stop`, {
            method: "POST",
        });
        const data = await response.json();
        if (response.ok) {
            getTasks(); // Refresh the task list
            await checkTaskStatus(taskId); // Check task status periodically
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error stopping task:", error);
    }
};

// Pause Task
const pauseTask = async (taskId) => {
    try {
        const response = await fetch(`${apiUrl}/${taskId}/pause`, {
            method: "POST",
        });
        const data = await response.json();
        if (response.ok) {
            getTasks(); // Refresh the task list
            await checkTaskStatus(taskId); // Check task status periodically
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error pausing task:", error);
    }
};

// Resume Task
const resumeTask = async (taskId) => {
    try {
        const response = await fetch(`${apiUrl}/${taskId}/resume`, {
            method: "POST",
        });
        const data = await response.json();
        if (response.ok) {
            getTasks(); // Refresh the task list
            await checkTaskStatus(taskId); // Check task status periodically
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error resuming task:", error);
    }
};

// Restart Task
const restartTask = async (taskId) => {
    try {
        const response = await fetch(`${apiUrl}/${taskId}/restart`, {
            method: "POST",
        });
        const data = await response.json();
        if (response.ok) {
            getTasks(); // Refresh the task list
            await checkTaskStatus(taskId); // Check task status periodically
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error restarting task:", error);
    }
};

// Fill the task dependencies select
const fillTaskDependencies = async () => {
    try {
        const response = await fetch(apiUrl);
        const tasks = await response.json();
        const taskDependencies = document.getElementById("taskDependencies");
        taskDependencies.innerHTML = ""; // Clear the list

        tasks.forEach((task) => {
            const option = document.createElement("option");
            option.value = task._id;
            option.text = task.name;
            taskDependencies.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching tasks for dependencies:", error);
    }
};

// // Handle real-time task updates via Server-Sent Events (SSE)
// const eventSource = new EventSource("http://localhost:53100/api/tasks/updates");
// eventSource.onmessage = (event) => {
//     const updatedTask = JSON.parse(event.data);
//     // Update the task in the UI based on the updated task data
//     updateTaskInUI(updatedTask);
// };

// // Function to update the task in the UI
// const updateTaskInUI = (task) => {
//     const taskList = document.getElementById("taskList");
//     const taskItem = taskList.querySelector(`li[data-task-id='${task._id}']`);
//     if (taskItem) {
//         taskItem.querySelector(".state").textContent = task.state;
//         taskItem.querySelector(".status").textContent = task.status;
//         taskItem.className = getTaskClass(task.state);
//     }
// };

// Utility function to determine task class based on state
const getTaskClass = (state) => {
    switch (state) {
        case TASK_STATES.RUNNING:
            return "task-in-progress";
        case TASK_STATES.PAUSED:
            return "task-paused";
        case TASK_STATES.COMPLETED:
            return "task-completed";
        case TASK_STATES.STOPPED:
            return "task-stopped";
        default:
            return "";
    }
};

// Initial tasks and dependencies load
getTasks();
fillTaskDependencies();
