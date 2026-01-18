/* ====================================
   KANBAN BOARD - FETCH & RENDER LOGIC
   ==================================== */

// API Base URL
const API_URL = 'http://127.0.0.1:8000/tasks';

// DOM Elements - Columns
const todoColumn = document.getElementById('todoColumn');
const inprogressColumn = document.getElementById('inprogressColumn');
const doneColumn = document.getElementById('doneColumn');

// DOM Elements - Add Task Form
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

// DOM Elements - Task Counts
const todoCount = document.getElementById('todoCount');
const inprogressCount = document.getElementById('inprogressCount');
const doneCount = document.getElementById('doneCount');

/* ====================================
   INITIALIZATION
   ==================================== */

// Fetch and render tasks when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Kanban Board initialized');
    fetchTasks();
    
    // Add event listeners
    setupEventListeners();
});

/* ====================================
   EVENT LISTENERS
   ==================================== */

function setupEventListeners() {
    // Add task button click
    addTaskBtn.addEventListener('click', addNewTask);
    
    // Add task on Enter key press
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNewTask();
        }
    });
    
    console.log('✅ Event listeners attached');
}

/* ====================================
   FETCH TASKS FROM API
   ==================================== */

async function fetchTasks() {
    try {
        console.log('📡 Fetching tasks from API...');
        
        const response = await fetch(API_URL);
        
        // Check if response is OK
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        
        const tasks = await response.json();
        console.log('✅ Tasks fetched successfully:', tasks);
        
        // Clear all columns before rendering
        clearAllColumns();
        
        // Render each task in the appropriate column
        tasks.forEach(task => {
            renderTask(task);
        });
        
        // Update task counts
        updateTaskCounts(tasks);
        
    } catch (error) {
        console.error('❌ Error fetching tasks:', error);
        showError('Failed to load tasks. Make sure the backend is running on http://127.0.0.1:8000');
    }
}

/* ====================================
   RENDER TASK CARD
   ==================================== */

function renderTask(task) {
    // Create task card element
    const card = document.createElement('div');
    card.className = `task-card ${task.status}`;
    card.setAttribute('data-id', task.id);
    
    // Create task title
    const title = document.createElement('div');
    title.className = 'task-title';
    title.textContent = task.title;
    
    // Create actions container
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    
    // Add status action buttons based on current status
    if (task.status === 'todo') {
        const startBtn = createButton('▶ Start', 'btn-start', () => {
            console.log(`🚀 Starting task #${task.id}`);
        });
        actions.appendChild(startBtn);
    } else if (task.status === 'inprogress') {
        const completeBtn = createButton('✓ Complete', 'btn-complete', () => {
            console.log(`✅ Completing task #${task.id}`);
        });
        actions.appendChild(completeBtn);
    }
    
    // Add delete button (always present)
    const deleteBtn = createButton('✕ Delete', 'btn-delete', () => {
        console.log(`🗑️ Deleting task #${task.id}`);
    });
    actions.appendChild(deleteBtn);
    
    // Assemble the card
    card.appendChild(title);
    card.appendChild(actions);
    
    // Add card to the appropriate column
    const targetColumn = getColumnByStatus(task.status);
    targetColumn.appendChild(card);
}

/* ====================================
   HELPER FUNCTIONS
   ==================================== */

// Create a button element
function createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.className = `task-btn ${className}`;
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

// Get column element based on status
function getColumnByStatus(status) {
    switch (status) {
        case 'todo':
            return todoColumn;
        case 'inprogress':
            return inprogressColumn;
        case 'done':
            return doneColumn;
        default:
            console.warn(`⚠️ Unknown status: ${status}, defaulting to 'todo'`);
            return todoColumn;
    }
}

// Clear all columns
function clearAllColumns() {
    todoColumn.innerHTML = '';
    inprogressColumn.innerHTML = '';
    doneColumn.innerHTML = '';
}

// Update task count badges
function updateTaskCounts(tasks) {
    const counts = {
        todo: 0,
        inprogress: 0,
        done: 0
    };
    
    // Count tasks by status
    tasks.forEach(task => {
        if (counts.hasOwnProperty(task.status)) {
            counts[task.status]++;
        }
    });
    
    // Update count badges
    todoCount.textContent = counts.todo;
    inprogressCount.textContent = counts.inprogress;
    doneCount.textContent = counts.done;
    
    // Show empty state messages if no tasks
    if (counts.todo === 0) {
        showEmptyState(todoColumn, 'No tasks yet');
    }
    if (counts.inprogress === 0) {
        showEmptyState(inprogressColumn, 'No tasks in progress');
    }
    if (counts.done === 0) {
        showEmptyState(doneColumn, 'No completed tasks');
    }
}

// Show empty state message in a column
function showEmptyState(column, message) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-state';
    emptyDiv.textContent = message;
    column.appendChild(emptyDiv);
}

// Show error message in console and UI
function showError(message) {
    console.error('💥 ERROR:', message);
    
    // Show error in all columns
    [todoColumn, inprogressColumn, doneColumn].forEach(column => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'empty-state';
        errorDiv.style.color = '#ef4444';
        errorDiv.textContent = '⚠️ ' + message;
        column.appendChild(errorDiv);
    });
}