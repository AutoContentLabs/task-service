const apiUrl = "http://localhost:53100/api/tasks"; // API URL

// Create Task
const createTaskForm = document.getElementById("createTaskForm");
createTaskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const taskName = document.getElementById("taskName").value;
  const taskDescription =
    document.getElementById("taskDescription").value;

  const task = {
    name: taskName,
    description: taskDescription,
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
    } else {
      console.error("Error creating task:", data);
    }
  } catch (error) {
    console.error("Error creating task:", error);
  }
});

// Get Tasks
const getTasks = async () => {
  try {
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear the list

    tasks.forEach((task) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <strong>${task.name}</strong> - ${task.state} - ${task.status} 
        <div class="actions-container">
          <button onclick="startTask('${task._id}')">Start</button>
          <button onclick="pauseTask('${task._id}')">Pause</button>
          <button onclick="stopTask('${task._id}')">Stop</button>
          <button onclick="resumeTask('${task._id}')">Resume</button>
          <button onclick="restartTask('${task._id}')">Restart</button>
          <button onclick="deleteTask('${task._id}')" class="delete-btn">Delete</button> <!-- Silme butonu -->
        </div>
      `;
      taskList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

// Start Task
const startTask = async (taskId) => {
  try {
    const response = await fetch(`${apiUrl}/${taskId}/start`, {
      method: "POST",
    });
    const data = await response.json();
    if (response.ok) {
      getTasks(); // Refresh the task list
    } else {
      alert(`Error: ${data.message}`);
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
    const data = await response.json();
    if (response.ok) {
      getTasks(); // Refresh the task list
    } else {
      alert(`Error: ${data.message}`);
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
    const data = await response.json();
    if (response.ok) {
      getTasks(); // Refresh the task list
    } else {
      alert(`Error: ${data.message}`);
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
    const data = await response.json();
    if (response.ok) {
      getTasks(); // Refresh the task list
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
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error("Error restarting task:", error);
  }
};

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

// Get tasks initially when the page loads
getTasks();