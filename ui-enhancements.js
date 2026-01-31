// ===== PREMIUM UI ENHANCEMENT SYSTEM =====

class UIEnhancer {
  static init() {
    this.setupRippleEffects();
    this.setupScrollAnimations();
    this.setupMagneticButtons();
    this.setupToastNotifications();
    this.setupFormEnhancements();
    this.setupErrorHandling();
    console.log('✨ UI Enhancements Active');
  }

  static setupRippleEffects() {
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.remove();
          }
        }, 600);
      });
    });
  }

  static setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    document.querySelectorAll('.feature-card, .problem-card, .quote').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
      observer.observe(el);
    });
  }

  static setupMagneticButtons() {
    document.querySelectorAll('.btn, .feature-card').forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.02)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0px, 0px) scale(1)';
      });
    });
  }

  static setupToastNotifications() {
    window.showToast = (message, type = 'info', duration = 4000) => {
      // Remove existing toasts of the same type
      document.querySelectorAll(`.toast--${type}`).forEach(t => t.remove());
      
      const toast = document.createElement('div');
      toast.className = `toast toast--${type}`;
      toast.innerHTML = `
        <div class="toast__content">
          <div class="toast__icon">${this.getToastIcon(type)}</div>
          <div class="toast__message">${message}</div>
        </div>
      `;
      
      document.body.appendChild(toast);
      
      requestAnimationFrame(() => {
        toast.classList.add('toast--visible');
      });
      
      setTimeout(() => {
        if (toast.parentNode) {
          toast.classList.remove('toast--visible');
          setTimeout(() => {
            if (toast.parentNode) {
              toast.remove();
            }
          }, 400);
        }
      }, duration);
    };
  }

  static getToastIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }

  static setupFormEnhancements() {
    // Enhanced form validation
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
          // Remove previous error messages
          const prevError = input.parentNode.querySelector('.error-message');
          if (prevError) prevError.remove();
          
          if (!input.value.trim()) {
            isValid = false;
            this.highlightField(input, 'This field is required');
          } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
            isValid = false;
            this.highlightField(input, 'Please enter a valid email');
          }
        });
        
        if (!isValid) {
          e.preventDefault();
          window.showToast && window.showToast('Please fill in all required fields', 'error');
        }
      });
    });

    // Auto-save for forms with data-autosave
    document.querySelectorAll('[data-autosave]').forEach(input => {
      let saveTimeout;
      input.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          const key = input.dataset.autosave || input.name || input.id;
          if (key) {
            try {
              localStorage.setItem(`autosave_${key}`, input.value);
              window.showToast && window.showToast('Auto-saved', 'success');
            } catch (e) {
              console.warn('Auto-save failed:', e);
            }
          }
        }, 2000);
      });

      // Restore auto-saved content
      const key = input.dataset.autosave || input.name || input.id;
      if (key) {
        try {
          const saved = localStorage.getItem(`autosave_${key}`);
          if (saved && !input.value) {
            input.value = saved;
          }
        } catch (e) {
          console.warn('Auto-restore failed:', e);
        }
      }
    });
  }

  static highlightField(input, message) {
    input.style.borderColor = '#ef4444';
    input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    errorEl.style.cssText = `
      color: #ef4444;
      font-size: 12px;
      margin-top: 4px;
      animation: shake 0.3s ease-in-out;
    `;
    
    input.parentNode.appendChild(errorEl);
    
    input.addEventListener('input', () => {
      input.style.borderColor = '';
      input.style.boxShadow = '';
      if (errorEl.parentNode) {
        errorEl.remove();
      }
    }, { once: true });
  }

  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static setupErrorHandling() {
    // Global error handler to prevent crashes
    window.addEventListener('error', (e) => {
      console.error('Global error caught:', e.error || e);
      
      // Show error only in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.showToast && window.showToast(`Error: ${e.message || 'Unknown error'}`, 'error');
      }
      
      // Prevent the error from crashing the app
      e.preventDefault();
      return true;
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      
      // Show warning only in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.showToast && window.showToast('Promise rejection handled', 'warning');
      }
      
      // Prevent unhandled rejection errors
      e.preventDefault();
    });

    // Enhanced console error handling
    const originalConsoleError = console.error;
    console.error = function(...args) {
      originalConsoleError.apply(console, args);
      
      // Filter out common non-critical errors
      const errorStr = args.join(' ');
      if (!errorStr.includes('Non-Error promise rejection') && 
          !errorStr.includes('ResizeObserver loop limit exceeded')) {
        // Handle critical errors gracefully
      }
    };
  }
}

// Smooth scrolling enhancement
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Initialize UI enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    UIEnhancer.init();
    setupSmoothScrolling();
    
    // Show success message after initialization
    setTimeout(() => {
      if (window.showToast) {
        window.showToast('✨ Premium UI Loaded!', 'success', 3000);
      }
    }, 1000);
    
    console.log('🎨 Premium UI enhancement system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize UI enhancements:', error);
    
    // Fallback notification
    setTimeout(() => {
      const fallbackNotice = document.createElement('div');
      fallbackNotice.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: #fee2e2; border: 1px solid #fecaca; color: #dc2626;
        padding: 12px 16px; border-radius: 8px; font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      `;
      fallbackNotice.textContent = 'Some UI enhancements failed to load';
      document.body.appendChild(fallbackNotice);
      
      setTimeout(() => {
        if (fallbackNotice.parentNode) {
          fallbackNotice.remove();
        }
      }, 4000);
    }, 500);
  }
});

// Export for potential external usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UIEnhancer, setupSmoothScrolling };
}