// Simplified Chore Management System
document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize loading overlay
  const loadingOverlay = document.getElementById('loadingOverlay');
  
  // Hide loading overlay after page loads
  setTimeout(() => {
    loadingOverlay.classList.add('hidden');
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 500);
  }, 800);

  // Settings navigation
  const navItems = document.querySelectorAll('.nav-item');
  const settingsSections = document.querySelectorAll('.settings-section');

  // Initialize chores page
  initializeChoresPage();

  function initializeChoresPage() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize forms
    initializeForms();
    
    // Load chores and settings
    loadChores();
    loadSettings();
    
    // Initialize modals
    initializeModals();
  }

  // Navigation functionality
  function initializeNavigation() {
    navItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all nav items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Hide all sections
        settingsSections.forEach(section => section.classList.remove('active'));
        
        // Show target section
        const targetSection = this.getAttribute('data-section');
        const targetElement = document.getElementById(targetSection);
        if (targetElement) {
          targetElement.classList.add('active');
        }
        
        // Update URL hash
        window.location.hash = targetSection;
      });
    });

    // Handle initial hash on page load
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const targetNav = document.querySelector(`[data-section="${hash}"]`);
      if (targetNav) {
        targetNav.click();
      }
    }
  }

  // Form functionality
  function initializeForms() {
    const addChoreForm = document.getElementById('addChoreForm');
    const editChoreForm = document.getElementById('editChoreForm');
    
    if (addChoreForm) {
      addChoreForm.addEventListener('submit', handleAddChore);
    }
    
    if (editChoreForm) {
      editChoreForm.addEventListener('submit', handleEditChore);
    }

    // Set default due date to tomorrow
    const dueDateInput = document.getElementById('dueDate');
    if (dueDateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueDateInput.value = tomorrow.toISOString().split('T')[0];
    }
  }

  // Handle add chore form submission
  async function handleAddChore(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    
    // Set loading state
    setLoadingState(submitBtn, true);
    
    try {
      const formData = new FormData(form);
      const choreData = {
        id: Date.now().toString(),
        title: formData.get('choreTitle'),
        description: formData.get('choreDescription'),
        category: formData.get('choreCategory'),
        priority: formData.get('chorePriority'),
        dueDate: formData.get('dueDate'),
        status: 'pending',
        assignedTo: null,
        createdAt: new Date().toISOString()
      };

      // Add chore to list
      addChoreToList(choreData);
      
      // Auto-assign if enabled
      if (isAutoAssignEnabled()) {
        choreData.assignedTo = getNextRoommateForChore();
        updateChoreAssignment(choreData);
      }
      
      // Save to localStorage
      saveChores();
      
      // Show success message
      showModal('successModal');
      document.getElementById('successMessage').textContent = 'Chore added successfully!';
      
      // Reset form
      form.reset();
      const dueDateInput = document.getElementById('dueDate');
      if (dueDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dueDateInput.value = tomorrow.toISOString().split('T')[0];
      }
      
    } catch (error) {
      console.error('Error adding chore:', error);
    } finally {
      // Reset loading state
      setLoadingState(submitBtn, false);
      submitBtn.querySelector('.btn-text').textContent = originalText;
    }
  }

  // Handle edit chore form submission
  async function handleEditChore(e) {
    e.preventDefault();
    
    const form = e.target;
    const choreId = document.getElementById('editChoreId').value;
    
    try {
      const formData = new FormData(form);
      const updatedChore = {
        id: choreId,
        title: formData.get('choreTitle'),
        description: formData.get('choreDescription'),
        category: formData.get('choreCategory'),
        priority: formData.get('chorePriority'),
        dueDate: formData.get('dueDate')
      };

      // Update chore in list
      updateChoreInList(updatedChore);
      
      // Save to localStorage
      saveChores();
      
      // Show success message
      showModal('successModal');
      document.getElementById('successMessage').textContent = 'Chore updated successfully!';
      
      // Close modal
      closeModal('editChoreModal');
      
    } catch (error) {
      console.error('Error updating chore:', error);
    }
  }

  // Set loading state for buttons
  function setLoadingState(button, loading) {
    if (loading) {
      button.classList.add('loading');
      button.disabled = true;
    } else {
      button.classList.remove('loading');
      button.disabled = false;
    }
  }

  // Load chores from localStorage
  function loadChores() {
    const savedChores = JSON.parse(localStorage.getItem('roomSyncChores')) || [];
    
    if (savedChores.length === 0) {
      // Create sample chores if none exist
      createSampleChores();
    } else {
      renderChoresList(savedChores);
    }
  }

  // Create sample chores
  function createSampleChores() {
    const sampleChores = [
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
      }
    ];
    
    localStorage.setItem('roomSyncChores', JSON.stringify(sampleChores));
    renderChoresList(sampleChores);
  }

  // Render chores list
  function renderChoresList(chores) {
    const choresList = document.getElementById('choresList');
    if (!choresList) return;
    
    if (chores.length === 0) {
      choresList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No chores found. Add your first chore!</p>';
      return;
    }
    
    choresList.innerHTML = chores.map(chore => renderChoreItem(chore)).join('');
  }

  // Render individual chore item
  function renderChoreItem(chore) {
    const assignedRoommate = getRoommateName(chore.assignedTo);
    const dueDate = new Date(chore.dueDate);
    const isOverdue = dueDate < new Date() && chore.status === 'pending';
    
    return `
      <div class="chore-item">
        <div class="chore-header">
          <div class="chore-title">${chore.title}</div>
          <div>
            <span class="chore-category ${chore.category}">${chore.category}</span>
            <span class="chore-priority ${chore.priority}">${chore.priority}</span>
          </div>
        </div>
        
        <div class="chore-description">${chore.description}</div>
        
        <div class="chore-footer">
          <div class="chore-due ${isOverdue ? 'overdue' : ''}">
            <i class="fas fa-calendar"></i>
            <span>Due: ${formatDate(dueDate)}</span>
            ${chore.assignedTo ? ` • Assigned to: ${assignedRoommate}` : ''}
          </div>
          
          <div class="chore-actions">
            <button class="btn-edit" onclick="editChore('${chore.id}')">
              <i class="fas fa-edit"></i>
              Edit
            </button>
            ${chore.status === 'pending' ? `
              <button class="btn-complete" onclick="completeChore('${chore.id}')">
                <i class="fas fa-check"></i>
                Complete
              </button>
            ` : ''}
            <button class="btn-delete" onclick="deleteChore('${chore.id}')">
              <i class="fas fa-trash"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Load settings from localStorage
  function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('roomSyncSettings')) || {};
    
    // Update rotation display
    const currentRotation = document.getElementById('currentRotation');
    const nextRotation = document.getElementById('nextRotation');
    const settingsRotation = document.getElementById('settingsRotation');
    const settingsAutoAssign = document.getElementById('settingsAutoAssign');
    const settingsNextRotation = document.getElementById('settingsNextRotation');
    
    if (currentRotation) {
      currentRotation.textContent = settings.choreRotation || 'Weekly';
    }
    if (nextRotation) {
      nextRotation.textContent = calculateNextRotation(settings.choreRotation);
    }
    if (settingsRotation) {
      settingsRotation.textContent = settings.choreRotation || 'Weekly';
    }
    if (settingsAutoAssign) {
      settingsAutoAssign.textContent = settings.autoAssignChores !== false ? 'Enabled' : 'Disabled';
    }
    if (settingsNextRotation) {
      settingsNextRotation.textContent = calculateNextRotation(settings.choreRotation);
    }
    
    // Load roommate assignments
    loadRoommateAssignments();
  }

  // Load roommate assignments
  function loadRoommateAssignments() {
    const roommateAssignments = document.getElementById('roommateAssignments');
    if (!roommateAssignments) return;
    
    const chores = JSON.parse(localStorage.getItem('roomSyncChores')) || [];
    const roommates = [
      { id: 'john', name: 'John Doe' },
      { id: 'jane', name: 'Jane Smith' },
      { id: 'mike', name: 'Mike Johnson' }
    ];
    
    const assignments = roommates.map(roommate => {
      const assignedChores = chores.filter(chore => chore.assignedTo === roommate.id);
      return {
        ...roommate,
        choreCount: assignedChores.length
      };
    });
    
    roommateAssignments.innerHTML = assignments.map(roommate => `
      <div class="roommate-item">
        <div class="roommate-name">${roommate.name}</div>
        <div class="roommate-chores">${roommate.choreCount} chores assigned</div>
      </div>
    `).join('');
  }

  // Calculate next rotation date
  function calculateNextRotation(rotationType) {
    const now = new Date();
    let nextDate = new Date(now);
    
    switch (rotationType) {
      case 'weekly':
        nextDate.setDate(now.getDate() + 7);
        break;
      case 'biweekly':
        nextDate.setDate(now.getDate() + 14);
        break;
      case 'monthly':
        nextDate.setMonth(now.getMonth() + 1);
        break;
      default:
        nextDate.setDate(now.getDate() + 7);
    }
    
    return formatDate(nextDate);
  }

  // Get next day date string
  function getNextDay() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  // Get next week date string
  function getNextWeek() {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  }

  // Format date for display
  function formatDate(date) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Get roommate name by ID
  function getRoommateName(roommateId) {
    const roommates = {
      'john': 'John Doe',
      'jane': 'Jane Smith',
      'mike': 'Mike Johnson'
    };
    return roommates[roommateId] || 'Unassigned';
  }

  // Check if auto-assignment is enabled
  function isAutoAssignEnabled() {
    const settings = JSON.parse(localStorage.getItem('roomSyncSettings')) || {};
    return settings.autoAssignChores !== false;
  }

  // Get next roommate for chore assignment
  function getNextRoommateForChore() {
    const chores = JSON.parse(localStorage.getItem('roomSyncChores')) || [];
    const roommates = ['john', 'jane', 'mike'];
    
    // Simple round-robin assignment
    const currentWeek = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
    const roommateIndex = currentWeek % roommates.length;
    
    return roommates[roommateIndex];
  }

  // Add chore to list
  function addChoreToList(chore) {
    const chores = JSON.parse(localStorage.getItem('roomSyncChores')) || [];
    chores.push(chore);
    localStorage.setItem('roomSyncChores', JSON.stringify(chores));
    renderChoresList(chores);
  }

  // Update chore in list
  function updateChoreInList(updatedChore) {
    const chores = JSON.parse(localStorage.getItem('roomSyncChores')) || [];
    const index = chores.findIndex(chore => chore.id === updatedChore.id);
    
    if (index !== -1) {
      chores[index] = { ...chores[index], ...updatedChore };
      localStorage.setItem('roomSyncChores', JSON.stringify(chores));
      renderChoresList(chores);
    }
  }

  // Update chore assignment
  function updateChoreAssignment(chore) {
    const chores = JSON.parse(localStorage.getItem('roomSyncChores')) || [];
    const index = chores.findIndex(c => c.id === chore.id);
    
    if (index !== -1) {
      chores[index].assignedTo = chore.assignedTo;
      localStorage.setItem('roomSyncChores', JSON.stringify(chores));
      renderChoresList(chores);
      loadRoommateAssignments();
    }
  }

  // Save chores to localStorage
  function saveChores() {
    // This function is called after operations to ensure data persistence
    console.log('Chores saved to localStorage');
  }

  // Modal functionality
  function initializeModals() {
    // Auto assign button
    const autoAssignBtn = document.getElementById('autoAssignBtn');
    if (autoAssignBtn) {
      autoAssignBtn.addEventListener('click', autoAssignChores);
    }

    // Reset assignments button
    const resetAssignmentsBtn = document.getElementById('resetAssignmentsBtn');
    if (resetAssignmentsBtn) {
      resetAssignmentsBtn.addEventListener('click', resetAssignments);
    }

    // Close modals on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
          hideModal(openModal);
        }
      }
    });
  }

  // Auto assign chores
  function autoAssignChores() {
    if (!isAutoAssignEnabled()) {
      alert('Auto-assignment is disabled in settings. Please enable it in Room Settings.');
      return;
    }
    
    const chores = JSON.parse(localStorage.getItem('roomSyncChores')) || [];
    const roommates = ['john', 'jane', 'mike'];
    
    chores.forEach((chore, index) => {
      if (!chore.assignedTo) {
        const roommateIndex = index % roommates.length;
        chore.assignedTo = roommates[roommateIndex];
      }
    });
    
    localStorage.setItem('roomSyncChores', JSON.stringify(chores));
    renderChoresList(chores);
    loadRoommateAssignments();
    
    showModal('successModal');
    document.getElementById('successMessage').textContent = 'All chores have been automatically assigned!';
  }

  // Reset assignments
  function resetAssignments() {
    if (confirm('Are you sure you want to remove all chore assignments?')) {
      const chores = JSON.parse(localStorage.getItem('roomSyncChores')) || [];
      
      chores.forEach(chore => {
        chore.assignedTo = null;
      });
      
      localStorage.setItem('roomSyncChores', JSON.stringify(chores));
      renderChoresList(chores);
      loadRoommateAssignments();
      
      showModal('successModal');
      document.getElementById('successMessage').textContent = 'All assignments have been reset!';
    }
  }

  // Show modal
  function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  // Hide modal
  function hideModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }

  // Close modal function (for onclick)
  window.closeModal = function(modalId) {
    hideModal(document.getElementById(modalId));
  }

  // Edit chore function (for onclick)
  window.editChore = function(choreId) {
    const chores = JSON.parse(localStorage.getItem('roomSyncChores')) || [];
    const chore = chores.find(c => c.id === choreId);
    
    if (chore) {
      // Populate edit form
      document.getElementById('editChoreId').value = chore.id;
      document.getElementById('editChoreTitle').value = chore.title;
      document.getElementById('editChoreDescription').value = chore.description;
      document.getElementById('editChoreCategory').value = chore.category;
      document.getElementById('editChorePriority').value = chore.priority;
      document.getElementById('editDueDate').value = chore.dueDate;
      
      // Show modal
      showModal('editChoreModal');
    }
  };

  // Complete chore function (for onclick)
  window.completeChore = function(choreId) {
    const chores = JSON.parse(localStorage.getItem('roomSyncChores')) || [];
    const index = chores.findIndex(chore => chore.id === choreId);
    
    if (index !== -1) {
      chores[index].status = 'completed';
      chores[index].completedAt = new Date().toISOString();
      
      localStorage.setItem('roomSyncChores', JSON.stringify(chores));
      renderChoresList(chores);
      
      showModal('successModal');
      document.getElementById('successMessage').textContent = 'Chore marked as completed!';
    }
  };

  // Delete chore function (for onclick)
  window.deleteChore = function(choreId) {
    if (confirm('Are you sure you want to delete this chore?')) {
      const chores = JSON.parse(localStorage.getItem('roomSyncChores')) || [];
      const filteredChores = chores.filter(chore => chore.id !== choreId);
      
      localStorage.setItem('roomSyncChores', JSON.stringify(filteredChores));
      renderChoresList(filteredChores);
      loadRoommateAssignments();
      
      showModal('successModal');
      document.getElementById('successMessage').textContent = 'Chore deleted successfully!';
    }
  };

  // Console welcome message
  console.log(`
    🧹 Welcome to RoomSync Chore Management!
    
    🎯 Features:
    - Add new chores with categories and priorities
    - View and edit existing chores
    - Automatic chore assignment based on settings
    - Syncs with your room settings page
    
    📱 Navigation:
    - Add Chore: Create new household tasks
    - View Chores: See all chores and manage them
    - Assignments: View current chore distribution
    - Chore Settings: Link to room settings
    
    🚀 Try adding a new chore or viewing existing ones!
  `);
});
