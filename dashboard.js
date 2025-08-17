// RoomSync Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initializeDashboard();
    
    // Set up event listeners
    setupEventListeners();
});

function initializeDashboard() {
    // Set default room to Room 1 (only room available)
    currentRoom = 1;
    updateRoomDisplay();
}

function setupEventListeners() {
    // Task action buttons
    setupTaskActions();
    
    // Floating add button
    const floatingAddBtn = document.querySelector('#addTaskBtn');
    floatingAddBtn.addEventListener('click', function() {
        showAddTaskModal();
    });

    // Edit buttons
    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            handleEditClick(this);
        });
    });

    // Money button
    const moneyBtn = document.querySelector('#moneyBtn');
    moneyBtn.addEventListener('click', function() {
        handleMoneyClick();
    });

    // Add Expense button
    const addExpenseBtn = document.querySelector('#addExpenseBtn');
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', function() {
            showAddExpenseModal();
        });
    }

    // Room button
    const roomBtn = document.querySelector('#goToRoomBtn');
    roomBtn.addEventListener('click', function() {
        handleRoomButtonClick();
    });

    // Notification button
    const notificationBtn = document.querySelector('#notificationBtn');
    notificationBtn.addEventListener('click', function() {
        toggleNotificationPanel();
    });

    // Profile button
    const profileBtn = document.querySelector('#profileBtn');
    profileBtn.addEventListener('click', function() {
        toggleProfilePanel();
    });

    // Logout button
    const logoutBtn = document.querySelector('#logoutBtn');
    logoutBtn.addEventListener('click', function() {
        handleLogout();
    });

    // Close notification panel
    const closeNotification = document.querySelector('#closeNotification');
    closeNotification.addEventListener('click', function() {
        hideNotificationPanel();
    });

    // Close profile panel
    const closeProfile = document.querySelector('#closeProfile');
    closeProfile.addEventListener('click', function() {
        hideProfilePanel();
    });

    // Profile action buttons
    const editProfileBtn = document.querySelector('#editProfileBtn');
    editProfileBtn.addEventListener('click', function() {
        handleEditProfile();
    });

    const changePasswordBtn = document.querySelector('#changePasswordBtn');
    changePasswordBtn.addEventListener('click', function() {
        handleChangePassword();
    });

    // Close panels when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.notification-panel') && !e.target.closest('#notificationBtn')) {
            hideNotificationPanel();
        }
        if (!e.target.closest('.profile-panel') && !e.target.closest('#profileBtn')) {
            hideProfilePanel();
        }
    });
}

function setupTaskActions() {
    // Task check buttons
    const checkBtns = document.querySelectorAll('.task-check-btn');
    checkBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            handleTaskComplete(this);
        });
    });

    // Task edit buttons
    const editTaskBtns = document.querySelectorAll('.task-edit-btn');
    editTaskBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            handleTaskEdit(this);
        });
    });
}

function updateRoomDisplay() {
    // This function can be used to update room-specific information
    console.log('Room display updated');
}

function updateScore() {
    const currentScoreElement = document.querySelector('.stat-value[data-room="1"]');
    if (currentScoreElement) {
        let currentScore = parseInt(currentScoreElement.textContent.split('/')[0]);
        currentScore++;
        currentScoreElement.textContent = `${currentScore} / 9`;
        
        // Save score to localStorage
        localStorage.setItem('room1Score', currentScore);
    }
}

function handleTaskComplete(button) {
    const taskItem = button.closest('.task-item');
    const taskTitle = taskItem.querySelector('h4').textContent;
    
    // Add completion animation
    button.style.background = 'var(--success-color)';
    button.style.color = 'white';
    button.style.borderColor = 'var(--success-color)';
    
    // Update task status
    const statusElement = taskItem.querySelector('.task-status');
    statusElement.textContent = 'Completed';
    statusElement.style.background = '#d1fae5';
    statusElement.style.color = '#065f46';
    
    // Add completion effect
    taskItem.style.borderLeftColor = 'var(--success-color)';
    taskItem.style.background = '#f0fdf4';
    
    // Show success message
    showNotification(`Task "${taskTitle}" completed!`, 'success');
    
    // Update score (increment by 1)
    updateScore();
    
    // Update task in storage
    updateTaskInStorage(taskItem, 'completed');
}

function handleTaskEdit(button) {
    const taskItem = button.closest('.task-item');
    const taskTitle = taskItem.querySelector('h4').textContent;
    
    // Show edit modal or form
    showEditTaskModal(taskItem);
}

function handleEditClick(button) {
    const card = button.closest('.task-card, .expense-card');
    const cardTitle = card.querySelector('h3').textContent;
    
    if (cardTitle === 'My chores') {
        showEditChoresModal();
    } else if (cardTitle === 'You owe') {
        showEditExpensesModal();
    }
}

function handleMoneyClick() {
    // Navigate to expense page
    window.location.href = 'expense.html';
}

function handleRoomButtonClick() {
    // Navigate to room page
    window.location.href = 'room.html';
}

// Notification Panel Functions
function toggleNotificationPanel() {
    const panel = document.querySelector('#notificationPanel');
    if (panel.style.display === 'none') {
        showNotificationPanel();
    } else {
        hideNotificationPanel();
    }
}

function showNotificationPanel() {
    const panel = document.querySelector('#notificationPanel');
    panel.style.display = 'block';
    
    // Load notifications
    loadNotifications();
}

function hideNotificationPanel() {
    const panel = document.querySelector('#notificationPanel');
    panel.style.display = 'none';
}

function loadNotifications() {
    // Load notifications from storage or API
    const notificationList = document.querySelector('.notification-list');
    // This could be populated with real notifications
}

// Profile Panel Functions
function toggleProfilePanel() {
    const panel = document.querySelector('#profilePanel');
    if (panel.style.display === 'none') {
        showProfilePanel();
    } else {
        hideProfilePanel();
    }
}

function showProfilePanel() {
    const panel = document.querySelector('#profilePanel');
    panel.style.display = 'block';
}

function hideProfilePanel() {
    const panel = document.querySelector('#profilePanel');
    panel.style.display = 'none';
}

function handleEditProfile() {
    // Navigate to profile edit page or show modal
    showNotification('Edit Profile functionality coming soon!', 'info');
}

function handleChangePassword() {
    // Navigate to password change page or show modal
    showNotification('Change Password functionality coming soon!', 'info');
}

function handleLogout() {
    // Show logout notification
    showNotification('Logging out...', 'info');
    
    // Redirect to home page after delay
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 1000);
}

// Task Management Functions
function showAddTaskModal() {
    // Create a simple modal for adding tasks
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Add New Task</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="addTaskForm">
                    <div class="form-group">
                        <label for="taskTitle">Task Title</label>
                        <input type="text" id="taskTitle" required>
                    </div>
                    <div class="form-group">
                        <label for="taskDescription">Description</label>
                        <textarea id="taskDescription" required></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn-primary">Add Task</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    addModalStyles();
    
    // Handle form submission
    const form = document.getElementById('addTaskForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewTask();
    });
    
    // Handle close button
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function addNewTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    
    // Create new task element (always for Room 1)
    const newTask = createTaskElement(title, description, '1');
    
    // Add to tasks list
    const tasksList = document.querySelector('.tasks-list');
    tasksList.appendChild(newTask);
    
    // Set up event listeners for new task
    setupTaskActions();
    
    // Close modal
    closeModal();
    
    // Show success message
    showNotification(`Task "${title}" added successfully!`, 'success');
    
    // Save task to storage
    saveTaskToStorage(title, description, '1');
}

function createTaskElement(title, description, room) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.setAttribute('data-room', room);
    
    taskDiv.innerHTML = `
        <div class="task-content">
            <h4>${title}</h4>
            <p>${description}</p>
            <span class="task-status">In Progress</span>
        </div>
        <div class="task-actions">
            <button class="task-check-btn" title="Mark Complete">
                <i class="fas fa-check"></i>
            </button>
            <button class="task-edit-btn" title="Edit Task">
                <i class="fas fa-pencil-alt"></i>
            </button>
        </div>
    `;
    
    return taskDiv;
}

function showEditTaskModal(taskItem) {
    const taskTitle = taskItem.querySelector('h4').textContent;
    const taskDescription = taskItem.querySelector('p').textContent;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Edit Task</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editTaskForm">
                    <div class="form-group">
                        <label for="editTaskTitle">Task Title</label>
                        <input type="text" id="editTaskTitle" value="${taskTitle}" required>
                    </div>
                    <div class="form-group">
                        <label for="editTaskDescription">Description</label>
                        <textarea id="editTaskDescription" required>${taskDescription}</textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn-primary">Update Task</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    addModalStyles();
    
    // Handle form submission
    const form = document.getElementById('editTaskForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        updateTask(taskItem);
    });
    
    // Handle close button
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function updateTask(taskItem) {
    const newTitle = document.getElementById('editTaskTitle').value;
    const newDescription = document.getElementById('editTaskDescription').value;
    
    // Update task content
    taskItem.querySelector('h4').textContent = newTitle;
    taskItem.querySelector('p').textContent = newDescription;
    
    // Close modal
    closeModal();
    
    // Show success message
    showNotification('Task updated successfully!', 'success');
    
    // Update task in storage
    updateTaskInStorage(taskItem, 'updated');
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Storage Functions
function saveTaskToStorage(title, description, room) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const newTask = {
        id: Date.now(),
        title,
        description,
        room,
        status: 'In Progress',
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInStorage(taskItem, action) {
    // Update task in localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const taskTitle = taskItem.querySelector('h4').textContent;
    
    const taskIndex = tasks.findIndex(task => task.title === taskTitle);
    if (taskIndex !== -1) {
        if (action === 'completed') {
            tasks[taskIndex].status = 'Completed';
            tasks[taskIndex].completedAt = new Date().toISOString();
        } else if (action === 'updated') {
            tasks[taskIndex].title = taskItem.querySelector('h4').textContent;
            tasks[taskIndex].description = taskItem.querySelector('p').textContent;
            tasks[taskIndex].updatedAt = new Date().toISOString();
        }
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

// Modal and Notification Styles
function addModalStyles() {
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                backdrop-filter: blur(5px);
            }
            
            .modal {
                background: white;
                border-radius: 12px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(151, 0, 165, 0.3);
                animation: modalSlideIn 0.3s ease;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .modal-header h3 {
                color: #9700a5;
                font-size: 1.5rem;
                font-weight: 600;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #6b7280;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                background: #f3f4f6;
                color: #374151;
            }
            
            .form-group {
                margin-bottom: 1.5rem;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: #374151;
                font-weight: 500;
            }
            
            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #d1d5db;
                border-radius: 0.75rem;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }
            
            .form-group input:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #9700a5;
                box-shadow: 0 0 0 3px rgba(151, 0, 165, 0.1);
            }
            
            .form-group textarea {
                resize: vertical;
                min-height: 100px;
            }
            
            .form-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                margin-top: 2rem;
            }
            
            .btn-primary,
            .btn-secondary {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 1rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #9700a5 0%, #b43dc0 100%);
                color: white;
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(151, 0, 165, 0.3);
            }
            
            .btn-secondary {
                background: #f3f4f6;
                color: #374151;
            }
            
            .btn-secondary:hover {
                background: #e5e7eb;
            }
        `;
        document.head.appendChild(style);
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification styles
    addNotificationStyles();
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 3000);
    
    // Handle close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

function addNotificationStyles() {
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: white;
                border-radius: 1rem;
                padding: 1rem 1.5rem;
                box-shadow: 0 10px 40px rgba(151, 0, 165, 0.2);
                z-index: 1001;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 400px;
                border-left: 4px solid #9700a5;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-right: 1rem;
            }
            
            .notification i {
                color: #9700a5;
                font-size: 1.2rem;
            }
            
            .notification span {
                color: #374151;
                font-weight: 500;
            }
            
            .notification-close {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                background: none;
                border: none;
                font-size: 1.2rem;
                color: #6b7280;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .notification-close:hover {
                background: #f3f4f6;
                color: #374151;
            }
            
            .notification-success {
                border-left-color: #1bb05e;
            }
            
            .notification-success i {
                color: #1bb05e;
            }
            
            .notification-error {
                border-left-color: #e23b3b;
            }
            
            .notification-error i {
                color: #e23b3b;
            }
            
            .notification-warning {
                border-left-color: #ffce3a;
            }
            
            .notification-warning i {
                color: #ffce3a;
            }
        `;
        document.head.appendChild(style);
    }
}

function showEditChoresModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Edit Chores</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="chores-list">
                    <div class="chore-item">
                        <div class="chore-content">
                            <input type="text" class="chore-title-input" value="Take out trash" />
                            <textarea class="chore-description-input">Please empty the trash can and take it to the room. Doesn't repeat.</textarea>
                        </div>
                        <div class="chore-actions">
                            <button class="chore-delete-btn" title="Delete Chore">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="chore-item">
                        <div class="chore-content">
                            <input type="text" class="chore-title-input" value="Mop the floor" />
                            <textarea class="chore-description-input">Please mop every room to remove dust under the table.</textarea>
                        </div>
                        <div class="chore-actions">
                            <button class="chore-delete-btn" title="Delete Chore">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="add-chore-section">
                    <button class="btn-secondary" id="addChoreBtn">
                        <i class="fas fa-plus"></i> Add New Chore
                    </button>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="button" class="btn-primary" onclick="saveChoresChanges()">Save Changes</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    addModalStyles();
    addChoresEditStyles();
    
    // Handle close button
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Handle add chore button
    const addChoreBtn = modal.querySelector('#addChoreBtn');
    addChoreBtn.addEventListener('click', addNewChoreToModal);
    
    // Handle delete buttons
    const deleteBtns = modal.querySelectorAll('.chore-delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            deleteChoreFromModal(this);
        });
    });
}

function showEditExpensesModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Edit Expenses</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="expense-form">
                    <div class="form-group">
                        <label for="editTotalSpending">Total Spending</label>
                        <input type="number" id="editTotalSpending" value="1840.00" step="0.01" min="0">
                    </div>
                    <div class="form-group">
                        <label for="editYourExpenses">Your Expenses</label>
                        <input type="number" id="editYourExpenses" value="284.00" step="0.01" min="0">
                    </div>
                    <div class="form-group">
                        <label for="editYouOwe">You Owe</label>
                        <input type="number" id="editYouOwe" value="0.00" step="0.01" min="0">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="button" class="btn-primary" onclick="saveExpensesChanges()">Save Changes</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    addModalStyles();
    
    // Handle close button
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function showAddExpenseModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Add New Expense</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="addExpenseForm">
                    <div class="form-group">
                        <label for="expenseTitle">Expense Title</label>
                        <input type="text" id="expenseTitle" placeholder="e.g., Groceries, Utilities" required>
                    </div>
                    <div class="form-group">
                        <label for="expenseAmount">Amount (Rs.)</label>
                        <input type="number" id="expenseAmount" step="0.01" min="0" placeholder="0.00" required>
                    </div>
                    <div class="form-group">
                        <label for="expenseCategory">Category</label>
                        <select id="expenseCategory" required>
                            <option value="">Select Category</option>
                            <option value="groceries">Groceries</option>
                            <option value="utilities">Utilities</option>
                            <option value="rent">Rent</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="transportation">Transportation</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="expenseDate">Date</label>
                        <input type="date" id="expenseDate" required>
                    </div>
                    <div class="form-group">
                        <label for="expenseDescription">Description (Optional)</label>
                        <textarea id="expenseDescription" placeholder="Add any additional details..."></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="btn-primary">Add Expense</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    addModalStyles();
    
    // Set default date to today
    const dateInput = modal.querySelector('#expenseDate');
    dateInput.value = new Date().toISOString().split('T')[0];
    
    // Handle form submission
    const form = document.getElementById('addExpenseForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewExpense();
    });
    
    // Handle close button
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function addNewExpense() {
    const title = document.getElementById('expenseTitle').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    const date = document.getElementById('expenseDate').value;
    const description = document.getElementById('expenseDescription').value;
    
    // Create expense object
    const newExpense = {
        id: Date.now(),
        title,
        amount,
        category,
        date,
        description,
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    // Show success message
    showNotification(`Expense "${title}" added successfully!`, 'success');
    
    // Close modal
    closeModal();
    
    // Update dashboard if needed
    updateExpenseDisplay();
}

function updateExpenseDisplay() {
    // This function can be used to update the expense display on the dashboard
    // For now, we'll just show a notification that the expense was added
    console.log('Expense display updated');
}

function addNewChoreToModal() {
    const choresList = document.querySelector('.chores-list');
    const newChoreItem = document.createElement('div');
    newChoreItem.className = 'chore-item new-chore';
    newChoreItem.innerHTML = `
        <div class="chore-content">
            <input type="text" class="chore-title-input" placeholder="Enter chore title" />
            <textarea class="chore-description-input" placeholder="Enter chore description"></textarea>
        </div>
        <div class="chore-actions">
            <button class="chore-delete-btn" title="Delete Chore">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    choresList.appendChild(newChoreItem);
    
    // Add event listener to new delete button
    const deleteBtn = newChoreItem.querySelector('.chore-delete-btn');
    deleteBtn.addEventListener('click', function() {
        deleteChoreFromModal(this);
    });
}

function deleteChoreFromModal(deleteBtn) {
    const choreItem = deleteBtn.closest('.chore-item');
    choreItem.style.animation = 'slideOutLeft 0.3s ease';
    setTimeout(() => {
        choreItem.remove();
    }, 300);
}

function saveChoresChanges() {
    const choreItems = document.querySelectorAll('.chore-item');
    const updatedChores = [];
    
    choreItems.forEach(item => {
        const title = item.querySelector('.chore-title-input').value.trim();
        const description = item.querySelector('.chore-description-input').value.trim();
        
        if (title && description) {
            updatedChores.push({ title, description });
        }
    });
    
    // Update the dashboard with new chores
    updateDashboardChores(updatedChores);
    
    // Show success message
    showNotification('Chores updated successfully!', 'success');
    
    // Close modal
    closeModal();
}

function saveExpensesChanges() {
    const totalSpending = parseFloat(document.getElementById('editTotalSpending').value) || 0;
    const yourExpenses = parseFloat(document.getElementById('editYourExpenses').value) || 0;
    const youOwe = parseFloat(document.getElementById('editYouOwe').value) || 0;
    
    // Update the dashboard with new expense values
    updateDashboardExpenses(totalSpending, yourExpenses, youOwe);
    
    // Show success message
    showNotification('Expenses updated successfully!', 'success');
    
    // Close modal
    closeModal();
}

function updateDashboardChores(chores) {
    const tasksList = document.querySelector('.tasks-list');
    tasksList.innerHTML = '';
    
    chores.forEach(chore => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.setAttribute('data-room', '1');
        
        taskItem.innerHTML = `
            <div class="task-content">
                <h4>${chore.title}</h4>
                <p>${chore.description}</p>
                <span class="task-status">In Progress</span>
            </div>
            <div class="task-actions">
                <button class="task-check-btn" title="Mark Complete">
                    <i class="fas fa-check"></i>
                </button>
                <button class="task-edit-btn" title="Edit Task">
                    <i class="fas fa-pencil-alt"></i>
                </button>
            </div>
        `;
        
        tasksList.appendChild(taskItem);
    });
    
    // Re-setup task actions for new items
    setupTaskActions();
    
    // Save to localStorage
    localStorage.setItem('dashboardChores', JSON.stringify(chores));
}

function updateDashboardExpenses(totalSpending, yourExpenses, youOwe) {
    // Update expense amounts
    const amountElement = document.querySelector('.amount');
    const totalSpendingElement = document.querySelector('.expense-details p:first-child');
    const yourExpensesElement = document.querySelector('.expense-details p:last-child');
    
    amountElement.textContent = `Rs. ${youOwe.toFixed(2)}`;
    totalSpendingElement.innerHTML = `Total Spending: <strong>Rs. ${totalSpending.toFixed(2)}</strong>`;
    yourExpensesElement.innerHTML = `Your Expenses: <strong>Rs. ${yourExpenses.toFixed(2)}</strong>`;
    
    // Save to localStorage
    localStorage.setItem('dashboardExpenses', JSON.stringify({
        totalSpending,
        yourExpenses,
        youOwe
    }));
}

function addChoresEditStyles() {
    if (!document.getElementById('chores-edit-styles')) {
        const style = document.createElement('style');
        style.id = 'chores-edit-styles';
        style.textContent = `
            .chores-list {
                margin-bottom: 1.5rem;
            }
            
            .chore-item {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                padding: 1rem;
                border: 1px solid var(--border-color);
                border-radius: var(--border-radius);
                margin-bottom: 1rem;
                background: var(--bg-secondary);
            }
            
            .chore-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .chore-title-input {
                padding: 0.5rem;
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                font-weight: 600;
                font-size: 1rem;
            }
            
            .chore-description-input {
                padding: 0.5rem;
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                resize: vertical;
                min-height: 60px;
                font-size: 0.875rem;
            }
            
            .chore-title-input:focus,
            .chore-description-input:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 2px rgba(151, 0, 165, 0.1);
            }
            
            .chore-actions {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .chore-delete-btn {
                background: var(--error-color);
                color: white;
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: var(--transition);
            }
            
            .chore-delete-btn:hover {
                background: #c53030;
                transform: scale(1.1);
            }
            
            .add-chore-section {
                text-align: center;
                margin-bottom: 1.5rem;
                padding: 1rem;
                border: 2px dashed var(--border-color);
                border-radius: var(--border-radius);
            }
            
            .new-chore {
                animation: slideInDown 0.3s ease;
            }
            
            @keyframes slideInDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideOutLeft {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-100%);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Global variables
let currentRoom = 1;
