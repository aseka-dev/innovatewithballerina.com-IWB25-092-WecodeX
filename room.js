// RoomSync Room Page - Synced with Chore Management System
document.addEventListener('DOMContentLoaded', function() {
  
  // Global variables
  let currentDate = new Date();
  let selectedDate = null;
  let chores = [];
  let expenses = [];
  
  // DOM elements
  const currentMonthElement = document.getElementById('currentMonth');
  const calendarDatesElement = document.getElementById('calendarDates');
  const selectedDateSpan = document.getElementById('selected-date');
  const taskList = document.getElementById('task-list');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const choreGrid = document.getElementById('choreGrid');
  const statusFilter = document.getElementById('statusFilter');
  
  // Initialize room page
  initRoomPage();
  
  function initRoomPage() {
    // Load chores from localStorage
    loadChoresFromStorage();
    
    // Load expenses from localStorage
    loadExpensesFromStorage();
    
    // Initialize chore board
    initChoreBoard();
    
    // Initialize expenses section
    initExpensesSection();
    
    // Initialize calendar
    initCalendar();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup smooth scrolling for hero buttons
    setupSmoothScrolling();
  }
  
  // Load chores from localStorage (synced with chore management system)
  function loadChoresFromStorage() {
    const savedChores = JSON.parse(localStorage.getItem('roomSyncChores')) || [];
    
    if (savedChores.length === 0) {
      // Create sample chores if none exist (same as chore management system)
      createSampleChores();
    } else {
      chores = savedChores;
    }
    
    // Listen for storage changes to sync in real-time
    window.addEventListener('storage', function(e) {
      if (e.key === 'roomSyncChores') {
        chores = JSON.parse(e.newValue) || [];
        renderChoreBoard();
        renderCalendar();
      }
    });
  }

  // Load expenses from localStorage (synced with expenses management system)
  function loadExpensesFromStorage() {
    const savedExpenses = JSON.parse(localStorage.getItem('roomSyncExpenses')) || [];
    
    if (savedExpenses.length === 0) {
      // Create sample expenses if none exist (same as expenses management system)
      createSampleExpenses();
    } else {
      expenses = savedExpenses;
    }
    
    // Listen for storage changes to sync in real-time
    window.addEventListener('storage', function(e) {
      if (e.key === 'roomSyncExpenses') {
        expenses = JSON.parse(e.newValue) || [];
        updateExpensesSection();
      }
    });
  }
  
  // Create sample chores (same as chore management system)
  function createSampleChores() {
    chores = [
      {
        id: '1',
        title: 'Clean Kitchen',
        description: 'Wash dishes, clean countertops, sweep floor',
        category: 'cleaning',
        priority: 'high',
        dueDate: getNextDay(),
        status: 'pending',
        assignedTo: 'john',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Take Out Trash',
        description: 'Empty all trash bins and recycling',
        category: 'cleaning',
        priority: 'medium',
        dueDate: getNextWeek(),
        status: 'pending',
        assignedTo: 'jane',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Buy Groceries',
        description: 'Purchase weekly groceries and household items',
        category: 'shopping',
        priority: 'high',
        dueDate: getNextWeek(),
        status: 'completed',
        assignedTo: 'mike',
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('roomSyncChores', JSON.stringify(chores));
  }

  // Create sample expenses (same as expenses management system)
  function createSampleExpenses() {
    expenses = [
      {
        id: '1',
        title: 'Groceries',
        description: 'Weekly groceries for the house',
        amount: 8200,
        category: 'groceries',
        paidBy: 'john',
        date: '2025-04-06',
        splitType: 'equal',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Utilities',
        description: 'Electricity and water bills',
        amount: 3600,
        category: 'utilities',
        paidBy: 'jane',
        date: '2025-04-09',
        splitType: 'equal',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Internet',
        description: 'Monthly internet subscription',
        amount: 2400,
        category: 'internet',
        paidBy: 'mike',
        splitType: 'equal',
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('roomSyncExpenses', JSON.stringify(expenses));
  }
  
  // Initialize chore board
  function initChoreBoard() {
    renderChoreBoard();
    setupChoreFilters();
  }

  // Initialize expenses section
  function initExpensesSection() {
    updateExpensesSection();
  }
  
  // Render chore board with real data
  function renderChoreBoard() {
    if (!choreGrid) return;
    
    if (chores.length === 0) {
      choreGrid.innerHTML = '<div class="no-chores">No chores found. <a href="chores.html#add-chore">Add your first chore!</a></div>';
      return;
    }
    
    // Show only first 6 chores for preview
    const previewChores = chores.slice(0, 6);
    
    choreGrid.innerHTML = previewChores.map(chore => renderChoreCard(chore)).join('');
    
    // Setup status change handlers for each card
    setupChoreStatusHandlers();
  }

  // Update expenses section with real data
  function updateExpensesSection() {
    updateExpensesSummary();
    updateExpensesTable();
  }

  // Update expenses summary with real data
  function updateExpensesSummary() {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const perPerson = totalExpenses / 3; // Assuming 3 roommates
    const currentUser = 'john'; // This would come from user authentication
    
    // Calculate what current user owes
    const userExpenses = expenses.filter(expense => expense.paidBy === currentUser);
    const userPaid = userExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const userOwes = perPerson - userPaid;
    
    // Update summary display
    const owedElement = document.querySelector('.amount.owed');
    const totalElement = document.querySelector('.summary-item:nth-child(2) .amount');
    const shareElement = document.querySelector('.summary-item:nth-child(3) .amount');
    
    if (owedElement) {
      owedElement.textContent = `Rs. ${Math.max(0, userOwes).toFixed(2)}`;
      owedElement.className = userOwes > 0 ? 'amount owed' : 'amount';
    }
    
    if (totalElement) {
      totalElement.textContent = `Rs. ${totalExpenses.toLocaleString()}`;
    }
    
    if (shareElement) {
      shareElement.textContent = `Rs. ${perPerson.toFixed(2)}`;
    }
  }

  // Update expenses table with real data
  function updateExpensesTable() {
    const tableBody = document.querySelector('.expenses-table tbody');
    if (!tableBody) return;
    
    // Show only first 3 expenses for preview
    const previewExpenses = expenses.slice(0, 3);
    
    tableBody.innerHTML = previewExpenses.map(expense => renderExpenseRow(expense)).join('');
  }

  // Render individual expense row
  function renderExpenseRow(expense) {
    const splitAmount = (expense.amount / 3).toFixed(2); // Assuming 3 roommates
    const paidByPerson = getPersonName(expense.paidBy);
    
    return `
      <tr>
        <td>${formatDate(expense.date)}</td>
        <td>${expense.title}</td>
        <td class="amount-cell">Rs. ${expense.amount.toLocaleString()}</td>
        <td class="payer-cell">${paidByPerson}</td>
        <td class="split-cell">Rs. ${splitAmount}</td>
      </tr>
    `;
  }
  
  // Render individual chore card
  function renderChoreCard(chore) {
    const assignedRoommate = getRoommateName(chore.assignedTo);
    const dueDate = new Date(chore.dueDate);
    const isOverdue = dueDate < new Date() && chore.status === 'pending';
    const daysUntilDue = getDaysUntilDue(dueDate);
    
    // Determine status display
    let statusText, statusClass;
    if (chore.status === 'completed') {
      statusText = '🟢 Completed';
      statusClass = 'completed';
    } else if (isOverdue) {
      statusText = '🔴 Overdue';
      statusClass = 'overdue';
    } else {
      statusText = '🟡 Pending';
      statusClass = 'pending';
    }
    
    // Format due date text
    let dueText;
    if (chore.status === 'completed') {
      dueText = 'Completed';
    } else if (daysUntilDue === 0) {
      dueText = 'Due Today';
    } else if (daysUntilDue === 1) {
      dueText = 'Due Tomorrow';
    } else if (daysUntilDue < 0) {
      dueText = `Overdue ${Math.abs(daysUntilDue)} days`;
    } else {
      dueText = `Due in ${daysUntilDue} days`;
    }
    
    return `
      <article class="chore-card" data-id="${chore.id}">
        <div class="chore-header">
          <h3 class="chore-title">${chore.title}</h3>
          <div class="chore-assigned">
            <span class="assigned-text">${assignedRoommate}</span>
            <div class="avatar" title="${assignedRoommate}">${assignedRoommate.charAt(0).toUpperCase()}</div>
          </div>
        </div>
        <p class="status ${statusClass}">${statusText}</p>
        <p class="due">${dueText}</p>
        <div class="chore-meta">
          <span class="chore-category ${chore.category}">${chore.category}</span>
          <span class="chore-priority ${chore.priority}">${chore.priority}</span>
        </div>
        <select class="action-dropdown" aria-label="Update status">
          <option value="pending" ${chore.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="completed" ${chore.status === 'completed' ? 'selected' : ''}>Completed</option>
        </select>
      </article>
    `;
  }
  
  // Setup chore status change handlers
  function setupChoreStatusHandlers() {
    document.querySelectorAll('.action-dropdown').forEach(dropdown => {
      dropdown.addEventListener('change', function(e) {
        const choreId = this.closest('.chore-card').getAttribute('data-id');
        const newStatus = e.target.value;
        
        // Update chore status
        updateChoreStatus(choreId, newStatus);
      });
    });
  }
  
  // Update chore status
  function updateChoreStatus(choreId, newStatus) {
    const choreIndex = chores.findIndex(chore => chore.id === choreId);
    
    if (choreIndex !== -1) {
      chores[choreIndex].status = newStatus;
      
      if (newStatus === 'completed') {
        chores[choreIndex].completedAt = new Date().toISOString();
      }
      
      // Save to localStorage
      localStorage.setItem('roomSyncChores', JSON.stringify(chores));
      
      // Re-render chore board and calendar
      renderChoreBoard();
      renderCalendar();
      
      // Show success message
      showStatusUpdateMessage('Chore status updated successfully!');
    }
  }
  
  // Setup chore filters
  function setupChoreFilters() {
    if (statusFilter) {
      statusFilter.addEventListener('change', function() {
        const filterValue = this.value;
        filterChores(filterValue);
      });
    }
  }
  
  // Filter chores by status
  function filterChores(filterValue) {
    const choreCards = document.querySelectorAll('.chore-card');
    
    choreCards.forEach(card => {
      const statusEl = card.querySelector('.status');
      let shouldShow = true;
      
      switch (filterValue) {
        case 'pending':
          shouldShow = statusEl.classList.contains('pending');
          break;
        case 'completed':
          shouldShow = statusEl.classList.contains('completed');
          break;
        case 'overdue':
          shouldShow = statusEl.classList.contains('overdue');
          break;
        case 'all':
        default:
          shouldShow = true;
          break;
      }
      
      card.style.display = shouldShow ? '' : 'none';
    });
  }
  
  // Initialize calendar
  function initCalendar() {
    renderCalendar();
  }
  
  // Render calendar with real chore data
  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update header
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;
    
    // Clear previous dates
    calendarDatesElement.innerHTML = '';
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    // Adjust start date to include previous month's days to fill first week
    const dayOfWeek = firstDay.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    // Generate calendar grid
    let currentGridDate = new Date(startDate);
    
    while (currentGridDate <= endDate || currentGridDate.getDay() !== 0) {
      const dateCell = document.createElement('div');
      const dateString = currentGridDate.toISOString().split('T')[0];
      
      if (currentGridDate.getMonth() === month) {
        // Current month date
        dateCell.className = 'date-cell';
        dateCell.setAttribute('data-date', dateString);
        dateCell.textContent = currentGridDate.getDate();
        
        // Check if date has chores
        const choresForDate = getChoresForDate(dateString);
        if (choresForDate.length > 0) {
          dateCell.classList.add('has-tasks');
          dateCell.setAttribute('title', `${choresForDate.length} chore(s) due`);
        }
        
        // Check if it's today
        if (isToday(currentGridDate)) {
          dateCell.classList.add('today');
        }
        
        // Check if it's selected
        if (selectedDate && dateString === selectedDate) {
          dateCell.classList.add('active');
        }
      } else {
        // Other month date
        dateCell.className = 'date-cell other-month';
        dateCell.textContent = currentGridDate.getDate();
      }
      
      calendarDatesElement.appendChild(dateCell);
      
      // Move to next day
      currentGridDate.setDate(currentGridDate.getDate() + 1);
    }
  }
  
  // Get chores for a specific date
  function getChoresForDate(dateString) {
    return chores.filter(chore => {
      const choreDate = new Date(chore.dueDate).toISOString().split('T')[0];
      return choreDate === dateString;
    });
  }
  
  // Check if date is today
  function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
  
  // Setup event listeners
  function setupEventListeners() {
    // Previous month
    if (prevMonthBtn) {
      prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
      });
    }
    
    // Next month
    if (nextMonthBtn) {
      nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
      });
    }
    
    // Date selection
    if (calendarDatesElement) {
      calendarDatesElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('date-cell') && 
            !e.target.classList.contains('other-month')) {
          
          // Remove previous active state
          document.querySelectorAll('.date-cell.active').forEach(cell => {
            cell.classList.remove('active');
          });
          
          // Add active state to clicked date
          e.target.classList.add('active');
          
          // Get selected date
          const date = e.target.getAttribute('data-date');
          selectedDate = date;
          
          // Format and display selected date
          const formattedDate = new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
          
          selectedDateSpan.textContent = formattedDate;
          
          // Show chores for selected date
          const choresForDate = getChoresForDate(date);
          if (choresForDate.length > 0) {
            taskList.innerHTML = '';
            choresForDate.forEach(chore => {
              const taskCard = document.createElement('div');
              taskCard.className = 'task-card';
              taskCard.innerHTML = `
                <div class="task-person">${getRoommateName(chore.assignedTo)}</div>
                <div class="task-description">${chore.title}</div>
                <div class="task-time">${chore.description}</div>
                <div class="task-status ${chore.status}">${chore.status}</div>
              `;
              taskList.appendChild(taskCard);
            });
          } else {
            taskList.innerHTML = '<p class="no-tasks">No chores scheduled for this date</p>';
          }
        }
      });
    }
  }
  
  // Setup smooth scrolling for hero buttons
  function setupSmoothScrolling() {
    window.scrollToSection = function(sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    };
  }
  
  // Utility functions
  function getNextDay() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
  
  function getNextWeek() {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  }
  
  function getDaysUntilDue(dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  
  function getRoommateName(roommateId) {
    const roommates = {
      'john': 'John Doe',
      'jane': 'Jane Smith',
      'mike': 'Mike Johnson'
    };
    return roommates[roommateId] || 'Unassigned';
  }

  function getPersonName(personId) {
    const people = {
      'john': 'John Doe',
      'jane': 'Jane Smith',
      'mike': 'Mike Johnson'
    };
    return people[personId] || 'Unknown';
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
  
  function showStatusUpdateMessage(message) {
    // Create a simple toast message
    const toast = document.createElement('div');
    toast.className = 'status-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1bb05e;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
  
  // Add CSS animations for toast
  const toastStyles = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = toastStyles;
  document.head.appendChild(styleSheet);
  
  // Console welcome message
  console.log(`
    🏠 Welcome to RoomSync Room Page!
    
    🎯 Features:
    - Chore Board synced with chore management system
    - Expenses & Bills synced with expenses management system
    - Real-time chore status updates
    - Calendar showing actual chore due dates
    - Filter chores by status
    - Smooth navigation between sections
    
    🔗 Integration:
    - Chores loaded from localStorage (roomSyncChores)
    - Expenses loaded from localStorage (roomSyncExpenses)
    - Real-time sync with both chore and expense pages
    - Status changes saved automatically
    - Calendar highlights dates with chores
    
    🚀 Try filtering chores, updating statuses, or viewing the expenses summary!
  `);
}); 
