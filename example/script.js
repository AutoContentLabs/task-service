const apiUrl = 'http://localhost:53101/api/tasks';  // Your API URL

// Create Task
const createTaskForm = document.getElementById('createTaskForm');
createTaskForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const taskName = document.getElementById('taskName').value;
  const taskDescription = document.getElementById('taskDescription').value;
  const taskType = document.getElementById('taskType').value;
  const taskState = document.getElementById('taskState').value;
  const taskStatus = document.getElementById('taskStatus').value;
  const taskDependenciesInput = document.getElementById('taskDependenciesInput').value;
  const dependencies = taskDependenciesInput ? taskDependenciesInput.split(',').map(id => id.trim()) : [];

  // Collecting Actions
  const actions = [];
  const actionElements = document.getElementById('actionsContainer').children;
  for (let element of actionElements) {
    const actionType = element.querySelector('.actionType').value;
    const actionDetails = element.querySelector('.actionDetails').value;
    actions.push({ type: actionType, details: actionDetails });
  }

  const task = {
    name: taskName,
    description: taskDescription,
    type: taskType,
    state: taskState,
    status: taskStatus,
    dependencies: dependencies,
    actions: actions
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

// Add Action (for Task)
function addAction() {
  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action-item');

  const actionTypeSelect = document.createElement('select');
  actionTypeSelect.classList.add('actionType');
  actionTypeSelect.innerHTML = `
    <option value="START">Start</option>
    <option value="STOP">Stop</option>
    <option value="PAUSE">Pause</option>
    <option value="RESUME">Resume</option>
  `;

  const actionDetailsInput = document.createElement('input');
  actionDetailsInput.classList.add('actionDetails');
  actionDetailsInput.placeholder = 'Action details';

  actionContainer.appendChild(actionTypeSelect);
  actionContainer.appendChild(actionDetailsInput);

  document.getElementById('actionsContainer').appendChild(actionContainer);
}

// Get all tasks
const getTasksBtn = document.getElementById('getTasksBtn');
getTasksBtn.addEventListener('click', async () => {
  try {
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear the list

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

  const updatedTask = { status: newStatus };

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
