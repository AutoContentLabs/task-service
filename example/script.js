const apiUrl = "http://localhost:53101/api/tasks"; // API URL

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
    }
  } catch (error) {
    console.error("Error stopping task:", error);
  }
};

// Get tasks initially when the page loads
getTasks();