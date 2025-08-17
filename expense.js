// Expenses & Bills Management System
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

  // Global variables
  let expenses = [];
  let currentExpenseId = null;

  // Initialize expenses page
  initExpensesPage();

  function initExpensesPage() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize forms
    initializeForms();
    
    // Load expenses from localStorage
    loadExpensesFromStorage();
    
    // Initialize modals
    initializeModals();
    
    // Set default date to today
    setDefaultDate();
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
    const addExpenseForm = document.getElementById('addExpenseForm');
    const editExpenseForm = document.getElementById('editExpenseForm');
    
    if (addExpenseForm) {
      addExpenseForm.addEventListener('submit', handleAddExpense);
    }
    
    if (editExpenseForm) {
      editExpenseForm.addEventListener('submit', handleEditExpense);
    }
  }

  // Set default date to today
  function setDefaultDate() {
    const expenseDateInput = document.getElementById('expenseDate');
    if (expenseDateInput) {
      const today = new Date();
      expenseDateInput.value = today.toISOString().split('T')[0];
    }
  }

  // Handle add expense form submission
  async function handleAddExpense(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    
    // Set loading state
    setLoadingState(submitBtn, true);
    
    try {
      const formData = new FormData(form);
      const expenseData = {
        id: Date.now().toString(),
        title: formData.get('expenseTitle'),
        description: formData.get('expenseDescription'),
        amount: parseFloat(formData.get('expenseAmount')),
        category: formData.get('expenseCategory'),
        paidBy: formData.get('paidBy'),
        date: formData.get('expenseDate'),
        splitType: formData.get('splitType'),
        createdAt: new Date().toISOString()
      };

      // Add expense to list
      addExpenseToList(expenseData);
      
      // Save to localStorage
      saveExpenses();
      
      // Show success message
      showModal('successModal');
      document.getElementById('successMessage').textContent = 'Expense added successfully!';
      
      // Reset form
      form.reset();
      setDefaultDate();
      
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      // Reset loading state
      setLoadingState(submitBtn, false);
      submitBtn.querySelector('.btn-text').textContent = originalText;
    }
  }

  // Handle edit expense form submission
  async function handleEditExpense(e) {
    e.preventDefault();
    
    const form = e.target;
    const expenseId = document.getElementById('editExpenseId').value;
    
    try {
      const formData = new FormData(form);
      const updatedExpense = {
        id: expenseId,
        title: formData.get('expenseTitle'),
        description: formData.get('expenseDescription'),
        amount: parseFloat(formData.get('expenseAmount')),
        category: formData.get('expenseCategory'),
        paidBy: formData.get('paidBy'),
        date: formData.get('expenseDate')
      };

      // Update expense in list
      updateExpenseInList(updatedExpense);
      
      // Save to localStorage
      saveExpenses();
      
      // Show success message
      showModal('successModal');
      document.getElementById('successMessage').textContent = 'Expense updated successfully!';
      
      // Close modal
      closeModal('editExpenseModal');
      
    } catch (error) {
      console.error('Error updating expense:', error);
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

  // Load expenses from localStorage
  function loadExpensesFromStorage() {
    const savedExpenses = JSON.parse(localStorage.getItem('roomSyncExpenses')) || [];
    
    if (savedExpenses.length === 0) {
      // Create sample expenses if none exist
      createSampleExpenses();
    } else {
      expenses = savedExpenses;
    }
    
    // Listen for storage changes to sync in real-time
    window.addEventListener('storage', function(e) {
      if (e.key === 'roomSyncExpenses') {
        expenses = JSON.parse(e.newValue) || [];
        renderExpensesList();
        updateSummary();
        updateBalances();
      }
    });
  }

  // Create sample expenses
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

  // Add expense to list
  function addExpenseToList(expense) {
    expenses.push(expense);
    localStorage.setItem('roomSyncExpenses', JSON.stringify(expenses));
    renderExpensesList();
    updateSummary();
    updateBalances();
  }

  // Update expense in list
  function updateExpenseInList(updatedExpense) {
    const index = expenses.findIndex(expense => expense.id === updatedExpense.id);
    
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updatedExpense };
      localStorage.setItem('roomSyncExpenses', JSON.stringify(expenses));
      renderExpensesList();
      updateSummary();
      updateBalances();
    }
  }

  // Render expenses list
  function renderExpensesList() {
    const expensesList = document.getElementById('expensesList');
    if (!expensesList) return;
    
    if (expenses.length === 0) {
      expensesList.innerHTML = '<div class="no-expenses">No expenses found. <a href="#add-expense">Add your first expense!</a></div>';
      return;
    }
    
    expensesList.innerHTML = expenses.map(expense => renderExpenseItem(expense)).join('');
    
    // Setup expense action handlers
    setupExpenseActionHandlers();
  }

  // Render individual expense item
  function renderExpenseItem(expense) {
    const paidByPerson = getPersonName(expense.paidBy);
    const splitAmount = (expense.amount / 3).toFixed(2); // Assuming 3 roommates
    
    return `
      <div class="expense-item" data-id="${expense.id}">
        <div class="expense-header">
          <div class="expense-title">${expense.title}</div>
          <div class="expense-amount">Rs. ${expense.amount.toLocaleString()}</div>
        </div>
        
        <div class="expense-meta">
          <span class="expense-category ${expense.category}">${expense.category}</span>
          <span class="expense-date">${formatDate(expense.date)}</span>
        </div>
        
        <div class="expense-details">${expense.description}</div>
        
        <div class="expense-footer">
          <div class="expense-info">
            <span>Paid by: ${paidByPerson}</span>
            <span>Split: Rs. ${splitAmount}</span>
          </div>
          
          <div class="expense-actions">
            <button class="btn-edit" onclick="editExpense('${expense.id}')">
              <i class="fas fa-edit"></i>
              Edit
            </button>
            <button class="btn-delete" onclick="deleteExpense('${expense.id}')">
              <i class="fas fa-trash"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Setup expense action handlers
  function setupExpenseActionHandlers() {
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', function() {
        filterExpenses(this.value);
      });
    }
  }

  // Filter expenses by category
  function filterExpenses(category) {
    const expenseItems = document.querySelectorAll('.expense-item');
    
    expenseItems.forEach(item => {
      if (category === 'all') {
        item.style.display = '';
      } else {
        const expenseCategory = item.querySelector('.expense-category').textContent;
        item.style.display = expenseCategory === category ? '' : 'none';
      }
    });
  }

  // Update summary
  function updateSummary() {
    const totalExpenses = document.getElementById('totalExpenses');
    const perPerson = document.getElementById('perPerson');
    const thisMonth = document.getElementById('thisMonth');
    
    if (totalExpenses) {
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      totalExpenses.textContent = `Rs. ${total.toLocaleString()}`;
    }
    
    if (perPerson) {
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const perPersonAmount = (total / 3).toFixed(2); // Assuming 3 roommates
      perPerson.textContent = `Rs. ${perPersonAmount}`;
    }
    
    if (thisMonth) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      });
      const monthTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      thisMonth.textContent = `Rs. ${monthTotal.toLocaleString()}`;
    }
    
    updateCategoryBreakdown();
  }

  // Update category breakdown
  function updateCategoryBreakdown() {
    const categoryBreakdown = document.getElementById('categoryBreakdown');
    if (!categoryBreakdown) return;
    
    const categories = {};
    expenses.forEach(expense => {
      if (categories[expense.category]) {
        categories[expense.category] += expense.amount;
      } else {
        categories[expense.category] = expense.amount;
      }
    });
    
    categoryBreakdown.innerHTML = Object.entries(categories).map(([category, amount]) => `
      <div class="breakdown-item">
        <div class="breakdown-category">
          <span class="expense-category ${category}">${category}</span>
        </div>
        <div class="breakdown-amount">Rs. ${amount.toLocaleString()}</div>
      </div>
    `).join('');
  }

  // Update balances
  function updateBalances() {
    const balancesList = document.getElementById('balancesList');
    if (!balancesList) return;
    
    const people = ['john', 'jane', 'mike'];
    const balances = {};
    
    // Initialize balances
    people.forEach(person => {
      balances[person] = 0;
    });
    
    // Calculate balances
    expenses.forEach(expense => {
      const splitAmount = expense.amount / 3;
      balances[expense.paidBy] += expense.amount - splitAmount;
      people.forEach(person => {
        if (person !== expense.paidBy) {
          balances[person] -= splitAmount;
        }
      });
    });
    
    balancesList.innerHTML = people.map(person => {
      const balance = balances[person];
      let balanceClass = 'neutral';
      if (balance > 0) balanceClass = 'positive';
      if (balance < 0) balanceClass = 'negative';
      
      return `
        <div class="balance-item">
          <div class="balance-person">${getPersonName(person)}</div>
          <div class="balance-amount ${balanceClass}">
            ${balance > 0 ? '+' : ''}Rs. ${balance.toFixed(2)}
          </div>
        </div>
      `;
    }).join('');
  }

  // Modal functionality
  function initializeModals() {
    // Mark as paid button
    const markPaidBtn = document.getElementById('markPaidBtn');
    if (markPaidBtn) {
      markPaidBtn.addEventListener('click', markAllAsPaid);
    }

    // Reset balances button
    const resetBalancesBtn = document.getElementById('resetBalancesBtn');
    if (resetBalancesBtn) {
      resetBalancesBtn.addEventListener('click', resetAllBalances);
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportExpenses);
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

  // Mark all as paid
  function markAllAsPaid() {
    if (confirm('Are you sure you want to mark all expenses as paid? This will reset all balances.')) {
      // Clear all expenses
      expenses = [];
      localStorage.setItem('roomSyncExpenses', JSON.stringify(expenses));
      
      // Update displays
      renderExpensesList();
      updateSummary();
      updateBalances();
      
      // Show success message
      showModal('successModal');
      document.getElementById('successMessage').textContent = 'All expenses marked as paid!';
    }
  }

  // Reset all balances
  function resetAllBalances() {
    if (confirm('Are you sure you want to reset all balances? This will clear all expense history.')) {
      // Clear all expenses
      expenses = [];
      localStorage.setItem('roomSyncExpenses', JSON.stringify(expenses));
      
      // Update displays
      renderExpensesList();
      updateSummary();
      updateBalances();
      
      // Show success message
      showModal('successModal');
      document.getElementById('successMessage').textContent = 'All balances have been reset!';
    }
  }

  // Export expenses
  function exportExpenses() {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Generate CSV content
  function generateCSV() {
    const headers = ['Date', 'Title', 'Description', 'Amount', 'Category', 'Paid By', 'Split Amount'];
    const rows = expenses.map(expense => [
      expense.date,
      expense.title,
      expense.description,
      expense.amount,
      expense.category,
      getPersonName(expense.paidBy),
      (expense.amount / 3).toFixed(2)
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Save expenses to localStorage
  function saveExpenses() {
    localStorage.setItem('roomSyncExpenses', JSON.stringify(expenses));
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

  // Edit expense function (for onclick)
  window.editExpense = function(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);
    
    if (expense) {
      // Populate edit form
      document.getElementById('editExpenseId').value = expense.id;
      document.getElementById('editExpenseTitle').value = expense.title;
      document.getElementById('editExpenseDescription').value = expense.description;
      document.getElementById('editExpenseAmount').value = expense.amount;
      document.getElementById('editExpenseCategory').value = expense.category;
      document.getElementById('editPaidBy').value = expense.paidBy;
      document.getElementById('editExpenseDate').value = expense.date;
      
      // Show modal
      showModal('editExpenseModal');
    }
  };

  // Delete expense function (for onclick)
  window.deleteExpense = function(expenseId) {
    if (confirm('Are you sure you want to delete this expense?')) {
      expenses = expenses.filter(expense => expense.id !== expenseId);
      localStorage.setItem('roomSyncExpenses', JSON.stringify(expenses));
      
      renderExpensesList();
      updateSummary();
      updateBalances();
      
      showModal('successModal');
      document.getElementById('successMessage').textContent = 'Expense deleted successfully!';
    }
  };

  // Utility functions
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
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Console welcome message
  console.log(`
    💰 Welcome to RoomSync Expenses & Bills!
    
    🎯 Features:
    - Add and manage shared expenses
    - Track who paid what
    - Automatic balance calculations
    - Category-based organization
    - Export functionality
    
    📊 Sections:
    - Add Expense: Record new shared expenses
    - View Expenses: See all expenses with filtering
    - Summary: Overview and category breakdown
    - Settlements: Track who owes what
    
    🚀 Try adding a new expense or viewing the summary!
  `);
});
