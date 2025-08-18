// Enhanced RoomSync Settings Page JavaScript
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

  // Initialize settings page
  initializeSettings();

  function initializeSettings() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize forms
    initializeForms();
    
    // Initialize photo upload
    initializePhotoUpload();
    
    // Initialize password toggles
    initializePasswordToggles();
    
    // Initialize room code regeneration
    initializeRoomCodeRegeneration();
    
    // Initialize modals
    initializeModals();
    
    // Initialize form auto-save
    initializeFormAutoSave();
    
    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts();
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
    const forms = document.querySelectorAll('.settings-form');
    
    forms.forEach(form => {
      form.addEventListener('submit', handleFormSubmit);
    });
  }

  // Handle form submissions
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    
    // Set loading state
    setLoadingState(submitBtn, true);
    
    try {
      // Simulate API call
      await simulateFormSubmission(form.id);
      
      // Show success message
      showModal('successModal');
      
      // Save form data to localStorage
      saveFormData(form);
      
    } catch (error) {
      console.error('Form submission error:', error);
      // Show error message (you can implement error modal here)
    } finally {
      // Reset loading state
      setLoadingState(submitBtn, false);
      submitBtn.querySelector('.btn-text').textContent = originalText;
    }
  }

  // Simulate form submission
  function simulateFormSubmission(formId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Form ${formId} submitted successfully`);
        resolve({ success: true });
      }, 1500);
    });
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

  // Photo upload functionality
  function initializePhotoUpload() {
    const profilePhotoInput = document.getElementById('profilePhoto');
    const profilePhotoPreview = document.getElementById('profilePhotoPreview');
    
    if (profilePhotoInput && profilePhotoPreview) {
      profilePhotoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
              profilePhotoPreview.src = e.target.result;
              
              // Save to localStorage
              localStorage.setItem('profile_photo', e.target.result);
              
              // Show success message
              showToast('Profile photo updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
          } else {
            showToast('Please select a valid image file.', 'error');
          }
        }
      });
    }
  }

  // Password toggle functionality
  function initializePasswordToggles() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        
        const icon = this.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
      });
    });
  }

  // Room code regeneration
  function initializeRoomCodeRegeneration() {
    const regenerateBtn = document.getElementById('regenerateCodeBtn');
    const roomCodeInput = document.getElementById('roomCode');
    
    if (regenerateBtn && roomCodeInput) {
      regenerateBtn.addEventListener('click', function() {
        // Generate new room code
        const newCode = generateRoomCode();
        roomCodeInput.value = newCode;
        
        // Show confirmation
        showToast('Room code regenerated successfully!', 'success');
        
        // Save to localStorage
        localStorage.setItem('room_code', newCode);
      });
    }
  }

  // Generate random room code
  function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }


  //chore rotation
  // Chore Rotation extra fields
const choreRotation = document.getElementById("choreRotation");
const weeklyDayGroup = document.getElementById("weeklyDayGroup");
const monthlyDateGroup = document.getElementById("monthlyDateGroup");

function toggleChoreOptions() {
  const value = choreRotation.value;

  // Show Weekly Day when Weekly selected
  weeklyDayGroup.style.display = value === "weekly" ? "block" : "none";

  // Show Monthly Date when Monthly selected
  monthlyDateGroup.style.display = value === "monthly" ? "block" : "none";
}

// Initialize when page loads
toggleChoreOptions();

// Update on change
choreRotation.addEventListener("change", toggleChoreOptions);


  // Modal functionality
  function initializeModals() {
    // Delete account modal
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
      deleteAccountBtn.addEventListener('click', function() {
        showModal('deleteAccountModal');
      });
    }

    // Add payment modal
    const addPaymentBtn = document.getElementById('addPaymentBtn');
    if (addPaymentBtn) {
      addPaymentBtn.addEventListener('click', function() {
        showModal('addPaymentModal');
      });
    }

    // Payment form submission
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
      paymentForm.addEventListener('submit', handlePaymentFormSubmit);
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

  // Handle payment form submission
  async function handlePaymentFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Set loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';
    
    try {
      // Simulate API call
      await simulatePaymentAddition();
      
      // Show success message
      showToast('Payment method added successfully!', 'success');
      
      // Close modal
      hideModal(document.getElementById('addPaymentModal'));
      
      // Reset form
      form.reset();
      
    } catch (error) {
      showToast('Failed to add payment method. Please try again.', 'error');
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  // Simulate payment addition
  function simulatePaymentAddition() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  }

  // Form auto-save functionality
  function initializeFormAutoSave() {
    const forms = document.querySelectorAll('.settings-form');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');
      
      // Load saved data
      inputs.forEach(input => {
        const savedValue = localStorage.getItem(`settings_${input.name}`);
        if (savedValue && input.type !== 'file') {
          if (input.type === 'checkbox') {
            input.checked = savedValue === 'true';
          } else {
            input.value = savedValue;
          }
        }
      });
      
      // Save data as user types
      inputs.forEach(input => {
        input.addEventListener('input', function() {
          const value = this.type === 'checkbox' ? this.checked : this.value;
          localStorage.setItem(`settings_${this.name}`, value);
        });
        
        input.addEventListener('change', function() {
          const value = this.type === 'checkbox' ? this.checked : this.value;
          localStorage.setItem(`settings_${this.name}`, value);
        });
      });
    });
  }

  // Save form data
  function saveFormData(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      const value = input.type === 'checkbox' ? input.checked : input.value;
      localStorage.setItem(`settings_${input.name}`, value);
    });
  }

  // Keyboard shortcuts
  function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      // Ctrl/Cmd + S to save current form
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const activeSection = document.querySelector('.settings-section.active');
        if (activeSection) {
          const form = activeSection.querySelector('form');
          if (form) {
            form.dispatchEvent(new Event('submit'));
          }
        }
      }
      
      // Number keys 1-6 to navigate sections
      if (e.key >= '1' && e.key <= '6') {
        const sectionIndex = parseInt(e.key) - 1;
        const navItems = document.querySelectorAll('.nav-item');
        if (navItems[sectionIndex]) {
          navItems[sectionIndex].click();
        }
      }
    });
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

  // Confirm delete account
  window.confirmDeleteAccount = function() {
    // Simulate account deletion
    showToast('Account deletion initiated. You will receive a confirmation email.', 'warning');
    hideModal(document.getElementById('deleteAccountModal'));
    
    // Redirect to home page after delay
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  }

  // Show toast notification
  function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;
    
    // Add styles
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--error-color)' : 'var(--warning-color)'};
      color: white;
      padding: 16px 20px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-medium);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 5000);
  }

  // Enhanced input focus effects
  document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
    input.addEventListener('focus', function() {
      this.style.transform = 'scale(1.02)';
      this.style.boxShadow = '0 0 0 3px rgba(151, 0, 165, 0.1)';
    });
    
    input.addEventListener('blur', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = 'none';
    });
  });

  // Card number formatting
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 0) {
        value = value.match(/.{1,4}/g).join(' ');
      }
      
      e.target.value = value;
    });
  }

  // Expiry date formatting
  const expiryDateInput = document.getElementById('expiryDate');
  if (expiryDateInput) {
    expiryDateInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      
      e.target.value = value;
    });
  }

  // CVV formatting
  const cvvInput = document.getElementById('cvv');
  if (cvvInput) {
    cvvInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      e.target.value = value;
    });
  }

  // Console welcome message
  console.log(`
    ⚙️ Welcome to RoomSync Settings!
    
    🎯 Features:
    - Tabbed navigation between settings sections
    - Form auto-save to localStorage
    - Profile photo upload
    - Password visibility toggles
    - Room code regeneration
    - Payment method management
    - Responsive design
    
    ⌨️ Keyboard Shortcuts:
    - Ctrl/Cmd + S: Save current form
    - 1-6: Navigate to different sections
    - Escape: Close modals
    
    🚀 Try navigating between different settings sections!
  `);
});

// Add CSS for enhanced animations and toast notifications
const enhancedStyles = `
  .form-input:focus,
  .form-textarea:focus,
  .form-select:focus {
    transform: scale(1.02);
  }
  
  .btn-primary:active,
  .btn-secondary:active,
  .btn-danger:active {
    transform: scale(0.98);
  }
  
  .nav-item:hover {
    transform: translateX(4px);
  }
  
  .photo-upload .current-photo:hover {
    transform: scale(1.05);
  }
  
  .plan-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
  }
  
  .payment-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-light);
  }
  
  .toast {
    animation: slideInRight 0.3s ease;
  }
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .floating-shapes .shape {
    filter: blur(1px);
  }
  
  .floating-shapes .shape:hover {
    filter: blur(0px);
    transform: scale(1.1);
  }
`;

// Inject enhanced styles
const styleSheet = document.createElement('style');
styleSheet.textContent = enhancedStyles;
document.head.appendChild(styleSheet);
