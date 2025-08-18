// Enhanced RoomSync Login Page JavaScript
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

  // Form elements
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passwordToggle = document.getElementById('passwordToggle');
  const loginBtn = document.getElementById('loginBtn');
  const roomCodeInput = document.querySelector('.room-code-input');
  const roomCodeBtn = document.querySelector('.btn-room-code');

  // Error elements
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  // Modals
  const successModal = document.getElementById('successModal');
  const errorModal = document.getElementById('errorModal');

  // Form validation state
  let isFormValid = false;
  let isSubmitting = false;

  // Initialize form
  initializeForm();

  function initializeForm() {
    // Add input event listeners
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    
    // Add form submission
    loginForm.addEventListener('submit', handleFormSubmit);
    
    // Add password toggle
    passwordToggle.addEventListener('click', togglePasswordVisibility);
    
    // Add room code functionality
    roomCodeBtn.addEventListener('click', handleRoomCodeLogin);
    
    // Add real-time validation
    addRealTimeValidation();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
  }

  // Email validation
  function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      showError(emailInput, emailError, 'Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      showError(emailInput, emailError, 'Please enter a valid email address');
      return false;
    } else {
      showSuccess(emailInput, emailError);
      return true;
    }
  }

  // Password validation
  function validatePassword() {
    const password = passwordInput.value;
    
    if (!password) {
      showError(passwordInput, passwordError, 'Password is required');
      return false;
    } else if (password.length < 6) {
      showError(passwordInput, passwordError, 'Password must be at least 6 characters');
      return false;
    } else {
      showSuccess(passwordInput, passwordError);
      return true;
    }
  }

  // Show error state
  function showError(input, errorElement, message) {
    input.classList.remove('success');
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    isFormValid = false;
  }

  // Show success state
  function showSuccess(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.classList.remove('show');
    isFormValid = false;
  }

  // Toggle password visibility
  function togglePasswordVisibility() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    const icon = passwordToggle.querySelector('i');
    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
  }

  // Real-time validation
  function addRealTimeValidation() {
    let emailTimeout, passwordTimeout;
    
    emailInput.addEventListener('input', () => {
      clearTimeout(emailTimeout);
      emailTimeout = setTimeout(validateEmail, 500);
    });
    
    passwordInput.addEventListener('input', () => {
      clearTimeout(passwordTimeout);
      passwordTimeout = setTimeout(validatePassword, 500);
    });
  }

  // Form submission
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate form
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    if (!isEmailValid || !isPasswordValid) {
      shakeForm();
      return;
    }
    
    // Start submission
    isSubmitting = true;
    setLoadingState(true);
    
    try {
      // Simulate API call
      await simulateLogin();
      
      // Show success
      showModal(successModal);
      
    } catch (error) {
      // Show error
      document.getElementById('errorMessage').textContent = error.message;
      showModal(errorModal);
      
    } finally {
      // Reset submission state
      isSubmitting = false;
      setLoadingState(false);
    }
  }

  // Simulate login API call
  function simulateLogin() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Demo validation (replace with actual API call)
        if (email === 'demo@roomsync.com' && password === 'demo123') {
          resolve({ success: true, user: { email, name: 'Demo User' } });
        } else {
          reject(new Error('Invalid email or password. Try demo@roomsync.com / demo123'));
        }
      }, 1500);
    });
  }

  // Room code login
  function handleRoomCodeLogin() {
    const roomCode = roomCodeInput.value.trim().toUpperCase();
    
    if (!roomCode) {
      shakeElement(roomCodeInput);
      return;
    }
    
    if (roomCode.length !== 8) {
      showRoomCodeError('Room code must be 8 characters');
      return;
    }
    
    // Simulate room code validation
    roomCodeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
    roomCodeBtn.disabled = true;
    
    setTimeout(() => {
      if (roomCode === 'DEMO1234') {
        showModal(successModal);
      } else {
        showRoomCodeError('Invalid room code. Try DEMO1234');
      }
      
      roomCodeBtn.innerHTML = '<i class="fas fa-door-open"></i> Join Room';
      roomCodeBtn.disabled = false;
    }, 1000);
  }

  // Show room code error
  function showRoomCodeError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'room-code-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      color: var(--error-color);
      font-size: 14px;
      margin-top: 8px;
      text-align: center;
    `;
    
    const existingError = document.querySelector('.room-code-error');
    if (existingError) {
      existingError.remove();
    }
    
    roomCodeInput.parentNode.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }

  // Set loading state
  function setLoadingState(loading) {
    if (loading) {
      loginBtn.classList.add('loading');
      loginBtn.disabled = true;
    } else {
      loginBtn.classList.remove('loading');
      loginBtn.disabled = false;
    }
  }

  // Show modal
  function showModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Auto-hide after 5 seconds for success modal
    if (modal === successModal) {
      setTimeout(() => {
        hideModal(modal);
      }, 5000);
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

  // Redirect to dashboard
  window.redirectToDashboard = function() {
    // Replace with actual dashboard URL
    window.location.href = 'dashboard.html';
  }

  // Form shake animation
  function shakeForm() {
    loginForm.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      loginForm.style.animation = '';
    }, 500);
  }

  // Element shake animation
  function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      element.style.animation = '';
    }, 500);
  }

  // Add shake animation CSS
  const shakeCSS = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = shakeCSS;
  document.head.appendChild(styleSheet);

  // Keyboard shortcuts
  function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Enter to submit form
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (document.activeElement === emailInput || document.activeElement === passwordInput) {
          handleFormSubmit(new Event('submit'));
        }
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
          hideModal(openModal);
        }
      }
    });
  }

  // Enhanced input focus effects
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
      this.parentNode.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
      this.parentNode.style.transform = 'scale(1)';
    });
  });

  // Auto-format room code
  roomCodeInput.addEventListener('input', function() {
    this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  });

  // Remember me functionality
  const rememberMeCheckbox = document.getElementById('rememberMe');
  const savedEmail = localStorage.getItem('roomsync_remembered_email');
  
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberMeCheckbox.checked = true;
  }
  
  rememberMeCheckbox.addEventListener('change', function() {
    if (this.checked) {
      localStorage.setItem('roomsync_remembered_email', emailInput.value);
    } else {
      localStorage.removeItem('roomsync_remembered_email');
    }
  });

  // Console welcome message
  console.log(`
    🔐 Welcome to RoomSync Login!
    
    �� Demo Credentials:
    Email: demo@roomsync.com
    Password: demo123
    
    �� Room Code: DEMO1234
    
    ✨ Features:
    - Real-time validation
    - Password visibility toggle
    - Room code quick access
    - Remember me functionality
    - Social login options
    - Responsive design
    
    �� Try the demo login or room code!
  `);
});

// Add CSS for enhanced animations
const enhancedStyles = `
  .form-input:focus {
    transform: scale(1.02);
  }
  
  .btn-primary:active {
    transform: scale(0.98);
  }
  
  .feature-item:hover {
    transform: translateX(8px) scale(1.02);
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
