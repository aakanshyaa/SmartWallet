/**
 * Smart Wallet - Global JavaScript
 * Contains global functionality used across the application
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize global button handlers
  initializeButtons();
  
  // Initialize modal functionality
  initializeModals();
  
  // Initialize icon selectors
  initializeIconSelectors();
});

/**
 * Initialize button handlers across the application
 */
function initializeButtons() {
  // Add buttons for each section
  initializeAddButtons();
  
  // Delete confirmation buttons
  initializeDeleteButtons();
  
  // Navigation buttons
  initializeNavigation();
}

/**
 * Initialize Add buttons for each section
 */
function initializeAddButtons() {
  // Income add button
  const addIncomeBtn = document.getElementById('addIncomeBtn');
  const addIncomeModal = document.getElementById('addIncomeModal');
  
  if (addIncomeBtn && addIncomeModal) {
    addIncomeBtn.addEventListener('click', function() {
      addIncomeModal.classList.add('show');
    });
  } else if (addIncomeBtn) {
    addIncomeBtn.addEventListener('click', function() {
      window.location.href = '/income/add';
    });
  }
  
  // Expense add button
  const addExpenseBtn = document.getElementById('addExpenseBtn');
  const addExpenseModal = document.getElementById('addExpenseModal');
  
  if (addExpenseBtn && addExpenseModal) {
    addExpenseBtn.addEventListener('click', function() {
      addExpenseModal.classList.add('show');
    });
  } else if (addExpenseBtn) {
    addExpenseBtn.addEventListener('click', function() {
      window.location.href = '/expense/add';
    });
  }
  
  // Savings add button
  const addSavingBtn = document.getElementById('addSavingBtn');
  const addSavingModal = document.getElementById('addSavingModal');
  
  if (addSavingBtn && addSavingModal) {
    addSavingBtn.addEventListener('click', function() {
      addSavingModal.classList.add('show');
    });
  } else if (addSavingBtn) {
    addSavingBtn.addEventListener('click', function() {
      window.location.href = '/savings/add';
    });
  }
  
  // Loan add button
  const addLoanBtn = document.getElementById('addLoanBtn');
  const addLoanModal = document.getElementById('addLoanModal');
  
  if (addLoanBtn && addLoanModal) {
    addLoanBtn.addEventListener('click', function() {
      addLoanModal.classList.add('show');
    });
  } else if (addLoanBtn) {
    addLoanBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = '/loans/add';
    });
  }
}

/**
 * Initialize modal functionality
 */
function initializeModals() {
  // Close buttons for all modals
  const closeModalBtns = document.querySelectorAll('.close-modal, .cancel-modal');
  
  if (closeModalBtns) {
    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const modal = this.closest('.modal');
        if (modal) {
          modal.classList.remove('show');
        }
      });
    });
  }
  
  // Close modals when clicking outside
  const modals = document.querySelectorAll('.modal');
  if (modals) {
    modals.forEach(modal => {
      modal.addEventListener('click', function(event) {
        if (event.target === this) {
          this.classList.remove('show');
        }
      });
    });
  }
  
  // Handle cancel buttons in forms
  const cancelButtons = document.querySelectorAll('.btn-secondary[href]');
  if (cancelButtons) {
    cancelButtons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        // Only prevent default if we're in a modal
        if (this.closest('.modal')) {
          e.preventDefault();
          const modal = this.closest('.modal');
          if (modal) {
            modal.classList.remove('show');
          }
        }
      });
    });
  }
}

/**
 * Initialize delete confirmation functionality
 */
function initializeDeleteButtons() {
  // Income delete buttons - Only attach if we're not on the income page
  // (to avoid conflicts with income.js which already handles this)
  const isIncomePage = window.location.pathname.includes('/income');
  const deleteIncomeBtns = document.querySelectorAll('.delete-income');
  const deleteIncomeModal = document.getElementById('deleteIncomeModal');
  
  if (deleteIncomeBtns && deleteIncomeModal && !isIncomePage) {
    deleteIncomeBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const id = this.getAttribute('data-id');
        document.getElementById('deleteIncomeId').value = id;
        deleteIncomeModal.classList.add('show');
      });
    });
  }
  
  // Expense delete buttons - Only attach if we're not on the expense page
  // (to avoid conflicts with expense.js which already handles this)
  const isExpensePage = window.location.pathname.includes('/expense');
  const deleteExpenseBtns = document.querySelectorAll('.delete-expense');
  const deleteExpenseModal = document.getElementById('deleteExpenseModal');
  
  if (deleteExpenseBtns && deleteExpenseModal && !isExpensePage) {
    deleteExpenseBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const id = this.getAttribute('data-id');
        document.getElementById('deleteExpenseId').value = id;
        deleteExpenseModal.classList.add('show');
      });
    });
  }
  
  // Savings delete buttons
  const deleteSavingBtns = document.querySelectorAll('.delete-saving');
  const deleteSavingModal = document.getElementById('deleteSavingModal');
  
  if (deleteSavingBtns && deleteSavingModal) {
    deleteSavingBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const id = this.getAttribute('data-id');
        document.getElementById('deleteSavingId').value = id;
        deleteSavingModal.classList.add('show');
      });
    });
  }
  
  // Loan delete buttons
  const isLoansPage = window.location.pathname.includes('/loans');
  const deleteLoanBtns = document.querySelectorAll('.delete-loan');
  const deleteLoanModal = document.getElementById('deleteLoanModal');
  
  if (deleteLoanBtns && deleteLoanModal && !isLoansPage) {
    deleteLoanBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const id = this.getAttribute('data-id');
        document.getElementById('deleteLoanId').value = id;
        deleteLoanModal.classList.add('show');
      });
    });
  }
}

/**
 * Initialize navigation buttons
 */
function initializeNavigation() {
  // Close mobile menu when a nav item is clicked
  const navItems = document.querySelectorAll('.nav-link');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (navItems && mobileMenu) {
    navItems.forEach(item => {
      item.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
      });
    });
  }
}

/**
 * Initialize icon selectors
 */
function initializeIconSelectors() {
  const iconSelectors = document.querySelectorAll('.icon-selector');
  
  if (iconSelectors) {
    iconSelectors.forEach(selector => {
      const selectedIcon = selector.querySelector('.selected-icon');
      const iconOptions = selector.querySelector('.icon-options');
      const iconItems = selector.querySelectorAll('.icon-item');
      const selectedIconInput = selector.querySelector('#selectedIcon');
      const iconSearch = selector.querySelector('#iconSearch');
      
      // Toggle icon options
      if (selectedIcon && iconOptions) {
        selectedIcon.addEventListener('click', function() {
          iconOptions.classList.toggle('hidden');
        });
      }
      
      // Select icon
      if (iconItems && selectedIcon && selectedIconInput) {
        iconItems.forEach(item => {
          item.addEventListener('click', function() {
            const icon = this.getAttribute('data-icon');
            selectedIcon.innerHTML = `<i class="fas fa-${icon}"></i>`;
            selectedIconInput.value = icon;
            iconOptions.classList.add('hidden');
          });
        });
      }
      
      // Search icons
      if (iconSearch && iconItems) {
        iconSearch.addEventListener('input', function() {
          const searchTerm = this.value.toLowerCase();
          
          iconItems.forEach(item => {
            const icon = item.getAttribute('data-icon').toLowerCase();
            
            if (icon.includes(searchTerm)) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
        });
      }
      
      // Close icon options when clicking outside
      document.addEventListener('click', function(e) {
        if (selector && !selector.contains(e.target)) {
          if (iconOptions) {
            iconOptions.classList.add('hidden');
          }
        }
      });
    });
  }
} 