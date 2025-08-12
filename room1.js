//coreboard functionality


  document.addEventListener('DOMContentLoaded', () => {
    // Status mapping
    const STATUS_CONFIG = {
      'completed':     { text: '🟢 Completed',      cls: 'completed' },
      'in-progress':   { text: '🟡 In Progress',    cls: 'in-progress' },
      'not-completed': { text: '🔴 Not Completed',  cls: 'not-completed' }
    };

    // Initialize each card's dropdown to reflect its current .status
    document.querySelectorAll('.chore-card').forEach(card => {
      const statusEl = card.querySelector('.status');
      const selectEl = card.querySelector('.action-dropdown');

      const currentVal =
        statusEl.classList.contains('completed') ? 'completed' :
        statusEl.classList.contains('not-completed') ? 'not-completed' :
        'in-progress';

      selectEl.value = currentVal;

      // On change, update status text + class
      selectEl.addEventListener('change', (e) => {
        const value = e.target.value;
        statusEl.classList.remove('completed', 'in-progress', 'not-completed');
        statusEl.classList.add(STATUS_CONFIG[value].cls);
        statusEl.textContent = STATUS_CONFIG[value].text;

        // Optional: persist to backend
        // fetch('/api/chores/{id}', { method:'PATCH', body: JSON.stringify({ status: value }) })
        //   .catch(console.error);
      });
    });

    // Filter by status
    const filterSelect = document.getElementById('statusFilter');
    filterSelect.addEventListener('change', () => {
      const val = filterSelect.value; // all | in-progress | completed | not-completed
      document.querySelectorAll('.chore-card').forEach(card => {
        const statusEl = card.querySelector('.status');
        const isMatch =
          val === 'all' ||
          (val === 'completed' && statusEl.classList.contains('completed')) ||
          (val === 'in-progress' && statusEl.classList.contains('in-progress')) ||
          (val === 'not-completed' && statusEl.classList.contains('not-completed'));
        card.style.display = isMatch ? '' : 'none';
      });
    });

    // Demo add chore (simple template append)
    document.getElementById('addChoreBtn').addEventListener('click', () => {
      const grid = document.querySelector('.chore-grid');
      const id = Math.floor(Math.random() * 100000);
      const card = document.createElement('article');
      card.className = 'chore-card';
      card.setAttribute('data-id', id);
      card.innerHTML = `
        <div class="chore-header">
          <h3 class="chore-title">New chore #${id}</h3>
          <img src="" alt="Assigned member" class="avatar" />
        </div>
        <p class="status in-progress">🟡 In Progress</p>
        <p class="due">Due soon</p>
        <select class="action-dropdown" aria-label="Update status">
          <option value="in-progress" selected>In Progress</option>
          <option value="completed">Completed</option>
          <option value="not-completed">Not Completed</option>
        </select>
      `;
      grid.prepend(card);

      // Wire up the new card
      const statusEl = card.querySelector('.status');
      const selectEl = card.querySelector('.action-dropdown');
      selectEl.addEventListener('change', (e) => {
        const value = e.target.value;
        statusEl.classList.remove('completed', 'in-progress', 'not-completed');
        statusEl.classList.add(STATUS_CONFIG[value].cls);
        statusEl.textContent = STATUS_CONFIG[value].text;
      });
    });
  });





// Calendar functionality
document.addEventListener('DOMContentLoaded', function() {
  let currentDate = new Date();
  let selectedDate = null;
  
  const currentMonthElement = document.getElementById('currentMonth');
  const calendarDatesElement = document.getElementById('calendarDates');
  const selectedDateSpan = document.getElementById('selected-date');
  const taskList = document.getElementById('task-list');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  
  // Sample tasks data - can be expanded for more dates
  const sampleTasks = {
    '2025-04-06': [
      { person: 'Alice', task: 'Buy groceries', time: '2:00 PM' },
      { person: 'Bob', task: 'Pay utilities', time: '10:00 AM' }
    ],
    '2025-04-09': [
      { person: 'Charlie', task: 'Internet bill', time: '3:00 PM' }
    ],
    '2025-04-15': [
      { person: 'Alice', task: 'Clean kitchen', time: '9:00 AM' },
      { person: 'Bob', task: 'Take out trash', time: '8:00 PM' }
    ],
    '2025-05-01': [
      { person: 'Alice', task: 'Monthly cleaning', time: '10:00 AM' }
    ],
    '2025-05-15': [
      { person: 'Bob', task: 'Pay rent', time: '9:00 AM' },
      { person: 'Charlie', task: 'Buy supplies', time: '2:00 PM' }
    ],
    '2025-06-01': [
      { person: 'Alice', task: 'Deep clean', time: '11:00 AM' }
    ]
  };
  
  // Initialize calendar
  function initCalendar() {
    renderCalendar();
    setupEventListeners();
  }
  
  // Render calendar for current month
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
        
        // Check if date has tasks
        if (sampleTasks[dateString]) {
          dateCell.classList.add('has-tasks');
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
    prevMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
    
    // Next month
    nextMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
    
    // Date selection
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
        
        // Show tasks for selected date
        if (sampleTasks[date]) {
          taskList.innerHTML = '';
          sampleTasks[date].forEach(task => {
            const taskCard = document.createElement('div');
            taskCard.className = 'task-card';
            taskCard.innerHTML = `
              <div class="task-person">${task.person}</div>
              <div class="task-description">${task.task}</div>
              <div class="task-time">${task.time}</div>
            `;
            taskList.appendChild(taskCard);
          });
        } else {
          taskList.innerHTML = '<p class="no-tasks">No tasks scheduled for this date</p>';
        }
      }
    });
  }
  
  // Initialize calendar
  initCalendar();
});


