const apiUrl = "http://localhost:53100/api/tasks"; // API URL
const taskUpdatesUrl = "http://localhost:53100/api/tasks-updates"; // EventSource URL

// Show Loading Indicator
const showLoading = () => {
  document.getElementById("loadingIndicator").style.display = "block";
};

// Hide Loading Indicator
const hideLoading = () => {
  document.getElementById("loadingIndicator").style.display = "none";
};

// Get Tasks with filter
const getTasks = async (filter = "all") => {
  showLoading(); // Show loading indicator
  try {
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear the list

    tasks
      .filter((task) => filter === "all" || task.state === filter)
      .forEach((task) => {
        const listItem = document.createElement("li");
        listItem.setAttribute("data-task-id", task._id);
        listItem.innerHTML = `
          <strong class="name">${task.name}</strong>
          <strong class="state">${task.state}</strong>
          <div class="task-type">Type: ${task.type}</div>
          <div class="actions-container">
            <button onclick="startTask('${task._id}')">Start</button>
            <button onclick="pauseTask('${task._id}')">Pause</button>
            <button onclick="stopTask('${task._id}')">Stop</button>
            <button onclick="resumeTask('${task._id}')">Resume</button>
            <button onclick="deleteTask('${task._id}')" class="delete-btn">Delete</button>
          </div>
        `;
        taskList.appendChild(listItem);
      });
  } catch (error) {
    console.error("Error fetching tasks:", error);
  } finally {
    hideLoading(); // Hide loading indicator
  }
};

// EventSource for Live Task Updates
const listenToTaskUpdates = () => {
  const eventSource = new EventSource(taskUpdatesUrl);

  eventSource.onmessage = (event) => {
    const taskUpdate = JSON.parse(event.data);
    console.log("Received Task Update: ", taskUpdate);

    // Find the task in the list and update it
    const taskList = document.getElementById("taskList");
    const taskItem = taskList.querySelector(`[data-task-id="${taskUpdate._id}"]`);

    if (taskItem) {
      // Update task state in the UI
      taskItem.querySelector(".state").textContent = taskUpdate.state;
      taskItem.querySelector(".task-type").textContent = `Type: ${taskUpdate.type}`;
      taskItem.classList.remove("task-in-progress", "task-paused", "task-completed", "task-stopped");

      // Apply the correct class based on the state
      if (taskUpdate.state === "RUNNING") {
        taskItem.classList.add("task-in-progress");
      } else if (taskUpdate.state === "COMPLETED") {
        taskItem.classList.add("task-completed");
      } else if (taskUpdate.state === "PAUSED") {
        taskItem.classList.add("task-paused");
      } else if (taskUpdate.state === "STOPPED") {
        taskItem.classList.add("task-stopped");
      }
    } else {
      // Task is not in the list, so add it
      const listItem = document.createElement("li");
      listItem.setAttribute("data-task-id", taskUpdate._id);
      listItem.innerHTML = `
        <strong class="name">${taskUpdate.name}</strong>
        <strong class="state">${taskUpdate.state}</strong>
        <div class="task-type">Type: ${taskUpdate.type}</div>
        <div class="actions-container">
          <button onclick="startTask('${taskUpdate._id}')">Start</button>
          <button onclick="pauseTask('${taskUpdate._id}')">Pause</button>
          <button onclick="stopTask('${taskUpdate._id}')">Stop</button>
          <button onclick="resumeTask('${taskUpdate._id}')">Resume</button>
          <button onclick="deleteTask('${taskUpdate._id}')" class="delete-btn">Delete</button>
        </div>
      `;
      taskList.appendChild(listItem);
    }
  };

  eventSource.onerror = (error) => {
    console.error("EventSource failed:", error);
    eventSource.close();
  };
};

// Create Task
const createTaskForm = document.getElementById("createTaskForm");
createTaskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const taskName = document.getElementById("taskName").value;
  const taskDescription = document.getElementById("taskDescription").value;
  const taskType = document.getElementById("taskType").value;
  const selectedDependencies = Array.from(
    document.getElementById("taskDependencies").options
  )
    .filter((option) => option.selected)
    .map((option) => option.value);

  if (taskName.trim() === "") {
    alert("Task name is required!");
    return;
  }

  const task = {
    name: taskName,
    description: taskDescription,
    type: taskType,
    dependencies: selectedDependencies,
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
      fillTaskDependencies(); // Refresh dependencies list
    } else {
      console.error("Error creating task:", data);
    }
  } catch (error) {
    console.error("Error creating task:", error);
  }
});

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

// Filter Tasks
const taskFilter = document.getElementById("taskFilter");
taskFilter.addEventListener("change", (event) => {
  getTasks(event.target.value);

});

// Start Task
const startTask = async (taskId) => {
  try {
    const response = await fetch(`${apiUrl}/${taskId}/start`, {
      method: "POST",
    });
    if (response.ok) {
      getTasks(); // Refresh the task list
    } else {
      alert("Error starting task");
    }
  } catch (error) {
    console.error("Error starting task:", error);
  }
};

// Pause Task
const pauseTask = async (taskId) => {
  try {
    const response = await fetch(`${apiUrl}/${taskId}/pause`, {
      method: "POST",
    });
    if (response.ok) {
      getTasks(); // Refresh the task list
    } else {
      alert("Error pausing task");
    }
  } catch (error) {
    console.error("Error pausing task:", error);
  }
};

// Stop Task
const stopTask = async (taskId) => {
  try {
    const response = await fetch(`${apiUrl}/${taskId}/stop`, {
      method: "POST",
    });
    if (response.ok) {
      getTasks(); // Refresh the task list
    } else {
      alert("Error stopping task");
    }
  } catch (error) {
    console.error("Error stopping task:", error);
  }
};

// Resume Task
const resumeTask = async (taskId) => {
  try {
    const response = await fetch(`${apiUrl}/${taskId}/resume`, {
      method: "POST",
    });
    if (response.ok) {
      getTasks(); // Refresh the task list
    } else {
      alert("Error resuming task");
    }
  } catch (error) {
    console.error("Error resuming task:", error);
  }
};

// Delete Task
const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`${apiUrl}/${taskId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      getTasks(); // Refresh the task list
      fillTaskDependencies(); // Refresh dependencies list
    } else {
      alert("Error deleting task");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

// Initial Setup
window.addEventListener("DOMContentLoaded", () => {
  getTasks(); // Fetch all tasks on page load
  fillTaskDependencies(); // Fill the task dependencies dropdown
  listenToTaskUpdates(); // Start listening to live task updates
});
