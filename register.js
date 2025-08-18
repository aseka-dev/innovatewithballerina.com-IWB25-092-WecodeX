// Enhanced RoomSync Register Page JavaScript
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
  const registerForm = document.getElementById('registerForm');
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const passwordToggle = document.getElementById('passwordToggle');
  const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
  const termsCheckbox = document.getElementById('terms');
  const registerBtn = document.getElementById('registerBtn');

  // Error elements
  const fullNameError = document.getElementById('fullNameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const passwordError = document.getElementById('passwordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  const termsError = document.getElementById('termsError');

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
    fullNameInput.addEventListener('input', validateFullName);
    emailInput.addEventListener('input', validateEmail);
    phoneInput.addEventListener('input', validatePhone);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    termsCheckbox.addEventListener('change', validateTerms);
    
    // Add form submission
    registerForm.addEventListener('submit', handleFormSubmit);
    
    // Add password toggles
    passwordToggle.addEventListener('click', () => togglePasswordVisibility(passwordInput, passwordToggle));
    confirmPasswordToggle.addEventListener('click', () => togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle));
    
    // Add real-time validation
    addRealTimeValidation();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
    
    // Add phone number formatting
    addPhoneNumberFormatting();
  }

  // Full Name validation
  function validateFullName() {
    const fullName = fullNameInput.value.trim();
    
    if (!fullName) {
      showError(fullNameInput, fullNameError, 'Full name is required');
      return false;
    } else if (fullName.length < 2) {
      showError(fullNameInput, fullNameError, 'Full name must be at least 2 characters');
      return false;
    } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      showError(fullNameInput, fullNameError, 'Full name can only contain letters and spaces');
      return false;
    } else {
      showSuccess(fullNameInput, fullNameError);
      return true;
    }
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

  // Phone validation
  function validatePhone() {
    const phone = phoneInput.value.trim();
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    
    if (!phone) {
      showError(phoneInput, phoneError, 'Phone number is required');
      return false;
    } else if (!phoneRegex.test(phone)) {
      showError(phoneInput, phoneError, 'Please enter a valid phone number (XXX-XXX-XXXX)');
      return false;
    } else {
      showSuccess(phoneInput, phoneError);
      return true;
    }
  }

  // Password validation
  function validatePassword() {
    const password = passwordInput.value;
    
    if (!password) {
      showError(passwordInput, passwordError, 'Password is required');
      return false;
    } else if (password.length < 8) {
      showError(passwordInput, passwordError, 'Password must be at least 8 characters');
      return false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      showError(passwordInput, passwordError, 'Password must contain uppercase, lowercase, and number');
      return false;
    } else {
      showSuccess(passwordInput, passwordError);
      // Re-validate confirm password if it has a value
      if (confirmPasswordInput.value) {
        validateConfirmPassword();
      }
      return true;
    }
  }

  // Confirm Password validation
  function validateConfirmPassword() {
    const confirmPassword = confirmPasswordInput.value;
    const password = passwordInput.value;
    
    if (!confirmPassword) {
      showError(confirmPasswordInput, confirmPasswordError, 'Please confirm your password');
      return false;
    } else if (confirmPassword !== password) {
      showError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match');
      return false;
    } else {
      showSuccess(confirmPasswordInput, confirmPasswordError);
      return true;
    }
  }

  // Terms validation
  function validateTerms() {
    if (!termsCheckbox.checked) {
      showError(termsCheckbox, termsError, 'You must agree to the terms and conditions');
      return false;
    } else {
      showSuccess(termsCheckbox, termsError);
      return false;
    }
  }

  // Show error state
  function showError(input, errorElement, message) {
    input.classList.remove('success');
    input.classList.add('error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
    isFormValid = false;
  }

  // Show success state
  function showSuccess(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    if (errorElement) {
      errorElement.classList.remove('show');
    }
    isFormValid = false;
  }

  // Toggle password visibility
  function togglePasswordVisibility(input, toggleButton) {
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    
    const icon = toggleButton.querySelector('i');
    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
  }

  // Phone number formatting
  function addPhoneNumberFormatting() {
    phoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 0) {
        if (value.length <= 3) {
          value = value;
        } else if (value.length <= 6) {
          value = value.slice(0, 3) + '-' + value.slice(3);
        } else {
          value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
        }
      }
      
      e.target.value = value;
    });
  }

  // Real-time validation
  function addRealTimeValidation() {
    let fullNameTimeout, emailTimeout, phoneTimeout, passwordTimeout, confirmPasswordTimeout;
    
    fullNameInput.addEventListener('input', () => {
      clearTimeout(fullNameTimeout);
      fullNameTimeout = setTimeout(validateFullName, 500);
    });
    
    emailInput.addEventListener('input', () => {
      clearTimeout(emailTimeout);
      emailTimeout = setTimeout(validateEmail, 500);
    });
    
    phoneInput.addEventListener('input', () => {
      clearTimeout(phoneTimeout);
      phoneTimeout = setTimeout(validatePhone, 500);
    });
    
    passwordInput.addEventListener('input', () => {
      clearTimeout(passwordTimeout);
      passwordTimeout = setTimeout(validatePassword, 500);
    });
    
    confirmPasswordInput.addEventListener('input', () => {
      clearTimeout(confirmPasswordTimeout);
      confirmPasswordTimeout = setTimeout(validateConfirmPassword, 500);
    });
  }

  // Form submission
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate all fields
    const isFullNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const isTermsValid = validateTerms();
    
    if (!isFullNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isConfirmPasswordValid || !isTermsValid) {
      shakeForm();
      return;
    }
    
    // Start submission
    isSubmitting = true;
    setLoadingState(true);
    
    try {
      const userData = {
      name: fullNameInput.value.trim(),
      email: emailInput.value.trim(),
      contacatNumber: phoneInput.value.trim(),
      password: passwordInput.value
    };

    const response = await fetch("http://localhost:8085/roomsync/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    const result = await response.json();
    console.log("✅ User registered:", result);

    // Show success
    showModal(successModal);

  } catch (error) {
    console.error("❌ Registration error:", error);
    document.getElementById('errorMessage').textContent = error.message;
    showModal(errorModal);

  } finally {
    isSubmitting = false;
    setLoadingState(false);
  }
}      

  // Set loading state
  function setLoadingState(loading) {
    if (loading) {
      registerBtn.classList.add('loading');
      registerBtn.disabled = true;
    } else {
      registerBtn.classList.remove('loading');
      registerBtn.disabled = false;
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

  // Redirect to login
  window.redirectToLogin = function() {
    window.location.href = 'login.html';
  }

  // Form shake animation
  function shakeForm() {
    registerForm.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      registerForm.style.animation = '';
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
        if (document.activeElement === fullNameInput || 
            document.activeElement === emailInput || 
            document.activeElement === phoneInput || 
            document.activeElement === passwordInput || 
            document.activeElement === confirmPasswordInput) {
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

  // Form auto-save functionality
  const formInputs = [fullNameInput, emailInput, phoneInput];
  
  // Load saved data
  formInputs.forEach(input => {
    const savedValue = localStorage.getItem(`register_${input.name}`);
    if (savedValue) {
      input.value = savedValue;
    }
  });
  
  // Save data as user types
  formInputs.forEach(input => {
    input.addEventListener('input', function() {
      localStorage.setItem(`register_${this.name}`, this.value);
    });
  });
  
  // Clear saved data on successful submission
  registerForm.addEventListener('submit', function() {
    if (validateForm()) {
      formInputs.forEach(input => {
        localStorage.removeItem(`register_${input.name}`);
      });
    }
  });

  // Validate entire form
  function validateForm() {
    return validateFullName() && 
           validateEmail() && 
           validatePhone() && 
           validatePassword() && 
           validateConfirmPassword() && 
           validateTerms();
  }

  // Console welcome message
  console.log(`
    🎉 Welcome to RoomSync Registration!
    
    ✨ Features:
    - Real-time validation
    - Password visibility toggle
    - Phone number formatting
    - Terms agreement
    - Social registration options
    - Responsive design
    - Form auto-save
    
    🚀 Try filling out the form to see the validation in action!
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
