// script.js

const apiUrl = 'http://localhost:50000/api/tasks';  // Write your API URL here

// Create Task
const createTaskForm = document.getElementById('createTaskForm');
createTaskForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const taskName = document.getElementById('taskName').value;
  const taskDescription = document.getElementById('taskDescription').value;

  const task = {
    name: taskName,
    description: taskDescription,
    status: 'IDLE',  // Default status
    dependencies: []
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    const data = await response.json();
    console.log('Task Created:', data);
    alert('Task Created!');
  } catch (error) {
    console.error('Error creating task:', error);
    alert('Error creating task');
  }
});

// Get all tasks
const getTasksBtn = document.getElementById('getTasksBtn');
getTasksBtn.addEventListener('click', async () => {
  try {
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear

    tasks.forEach(task => {
      const listItem = document.createElement('li');
      listItem.textContent = `${task.name} - Status: ${task.status}`;
      taskList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    alert('Error fetching tasks');
  }
});

// Update Task
const updateTaskForm = document.getElementById('updateTaskForm');
updateTaskForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const taskId = document.getElementById('updateTaskId').value;
  const newStatus = document.getElementById('updateTaskStatus').value;

  const updatedTask = {
    status: newStatus
  };

  try {
    const response = await fetch(`${apiUrl}/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });

    const data = await response.json();
    console.log('Task Updated:', data);
    alert('Task Updated!');
  } catch (error) {
    console.error('Error updating task:', error);
    alert('Error updating task');
  }
});

// Delete Task
const deleteTaskForm = document.getElementById('deleteTaskForm');
deleteTaskForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const taskId = document.getElementById('deleteTaskId').value;

  try {
    const response = await fetch(`${apiUrl}/${taskId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Task Deleted!');
    } else {
      alert('Failed to delete task');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('Error deleting task');
  }
});
