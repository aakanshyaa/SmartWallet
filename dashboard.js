/**
 * Smart Wallet - Dashboard JavaScript
 * Handles charts, modals, and interactive functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all the necessary components for the dashboard
  initializeApp();
  
  // Initialize Modal Functionality
  initializeModals();
  
  // Initialize Delete Confirmation
  initializeDeleteButtons();
  
  // Profile dropdown toggle
  const profileDropdownToggle = document.getElementById('profileDropdownToggle');
  const profileDropdown = document.getElementById('profileDropdown');
  
  if (profileDropdownToggle && profileDropdown) {
    profileDropdownToggle.addEventListener('click', function(e) {
      e.preventDefault();
      profileDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!profileDropdownToggle.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove('show');
      }
    });
  }
  
  // Edit profile modal functionality
  const editProfileBtn = document.getElementById('editProfileBtn');
  const profileModal = document.getElementById('editProfileModal');
  const closeProfileModal = document.getElementById('closeProfileModal');
  
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function(e) {
      e.preventDefault();
      profileDropdown.classList.remove('show'); // Hide dropdown first
      
      // If we have a profile modal, show it
      if (profileModal) {
        profileModal.classList.add('show');
      } else {
        // Fallback if modal doesn't exist yet
        alert('Edit profile functionality will be implemented soon!');
      }
    });
  }
  
  // Close profile modal
  if (closeProfileModal && profileModal) {
    closeProfileModal.addEventListener('click', function() {
      profileModal.classList.remove('show');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
      if (e.target === profileModal) {
        profileModal.classList.remove('show');
      }
    });
  }
});

/**
 * Initialize all charts on the dashboard
 */
function initializeCharts() {
  try {
    // Expense Bar Chart
    initializeExpenseChart();
    
    // Income Bar Chart
    initializeIncomeChart();
    
    // Line Chart for Expense Trends
    initializeExpenseTrendChart();
    
    // Expense Category Pie Chart
    initializeExpenseCategoryChart();
    
    // Income Source Pie Chart
    initializeIncomeSourceChart();
    
    // Financial Overview Chart 
    initializeFinancialOverviewChart();
    
    // Savings Trend Chart
    initializeSavingsTrendChart();
  } catch (error) {
    console.error('Error initializing charts:', error);
  }
}

/**
 * Initialize Expense Chart
 */
function initializeExpenseChart() {
  const expenseChartElement = document.getElementById('expenseChart');
  if (!expenseChartElement) return;

  // Destroy any existing chart instance
  const existingChart = Chart.getChart(expenseChartElement);
  if (existingChart) {
    existingChart.destroy();
  }
  
  const labels = JSON.parse(expenseChartElement.dataset.labels || '[]');
  const values = JSON.parse(expenseChartElement.dataset.values || '[]');
  
  new Chart(expenseChartElement, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Expenses',
        data: values,
        backgroundColor: 'rgba(126, 34, 206, 0.8)',
        borderColor: 'rgba(126, 34, 206, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value;
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return '$' + context.raw;
            }
          }
        }
      }
    }
  });
}

/**
 * Initialize Income Chart
 */
function initializeIncomeChart() {
  const incomeChartElement = document.getElementById('incomeChart');
  if (!incomeChartElement) return;

  // Destroy any existing chart instance
  const existingChart = Chart.getChart(incomeChartElement);
  if (existingChart) {
    existingChart.destroy();
  }
  
  const labels = JSON.parse(incomeChartElement.dataset.labels || '[]');
  const values = JSON.parse(incomeChartElement.dataset.values || '[]');
  
  new Chart(incomeChartElement, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Income',
        data: values,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value;
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return '$' + context.raw;
            }
          }
        }
      }
    }
  });
}

/**
 * Initialize Expense Trend Chart
 */
function initializeExpenseTrendChart() {
  const expenseTrendElement = document.getElementById('expenseTrendChart');
  if (!expenseTrendElement) return;

  // Destroy any existing chart instance
  const existingChart = Chart.getChart(expenseTrendElement);
  if (existingChart) {
    existingChart.destroy();
  }
  
  const labels = JSON.parse(expenseTrendElement.dataset.labels || '[]');
  const values = JSON.parse(expenseTrendElement.dataset.values || '[]');
  
  new Chart(expenseTrendElement, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Expense Trend',
        data: values,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value;
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return '$' + context.raw;
            }
          }
        }
      }
    }
  });
}

/**
 * Initialize Expense Category Chart
 */
function initializeExpenseCategoryChart() {
  const expenseCategoryElement = document.getElementById('expenseCategoryChart');
  if (!expenseCategoryElement) return;

  // Destroy any existing chart instance
  const existingChart = Chart.getChart(expenseCategoryElement);
  if (existingChart) {
    existingChart.destroy();
  }
  
  const labels = JSON.parse(expenseCategoryElement.dataset.labels || '[]');
  const values = JSON.parse(expenseCategoryElement.dataset.values || '[]');
  
  // Check if we have data
  if (labels.length === 0 || values.length === 0) {
    // If there's no parent element, we can't show a message
    const parent = expenseCategoryElement.parentElement;
    if (!parent) return;

    // Create empty state message
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-chart-message';
    emptyMessage.innerHTML = `
      <i class="fas fa-chart-pie fa-3x"></i>
      <p>No expense data available</p>
    `;
    
    // Replace canvas with message
    parent.replaceChild(emptyMessage, expenseCategoryElement);
    return;
  }
  
  new Chart(expenseCategoryElement, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(126, 34, 206, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderColor: 'white',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `₹${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

/**
 * Initialize Income Source Chart
 */
function initializeIncomeSourceChart() {
  const incomeSourceElement = document.getElementById('incomeSourceChart');
  if (!incomeSourceElement) return;

  // Destroy any existing chart instance
  const existingChart = Chart.getChart(incomeSourceElement);
  if (existingChart) {
    existingChart.destroy();
  }
  
  const labels = JSON.parse(incomeSourceElement.dataset.labels || '[]');
  const values = JSON.parse(incomeSourceElement.dataset.values || '[]');
  
  // Check if we have data
  if (labels.length === 0 || values.length === 0) {
    // If there's no parent element, we can't show a message
    const parent = incomeSourceElement.parentElement;
    if (!parent) return;

    // Create empty state message
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-chart-message';
    emptyMessage.innerHTML = `
      <i class="fas fa-chart-pie fa-3x"></i>
      <p>No income data available</p>
    `;
    
    // Replace canvas with message
    parent.replaceChild(emptyMessage, incomeSourceElement);
    return;
  }
  
  new Chart(incomeSourceElement, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(126, 34, 206, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: 'white',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `₹${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

/**
 * Initialize Financial Overview Chart
 */
function initializeFinancialOverviewChart() {
  const overviewChartElement = document.getElementById('financialOverviewChart');
  if (!overviewChartElement) return;

  // Destroy any existing chart instance
  const existingChart = Chart.getChart(overviewChartElement);
  if (existingChart) {
    existingChart.destroy();
  }
  
  const totalIncome = parseFloat(overviewChartElement.dataset.income || 0);
  const totalExpense = parseFloat(overviewChartElement.dataset.expense || 0);
  const balance = totalIncome - totalExpense;
  
  new Chart(overviewChartElement, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expenses'],
      datasets: [{
        data: [totalIncome, totalExpense],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: 'white',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `$${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
  
  // Add center text with balance if canvas context is available
  try {
    const ctx = overviewChartElement.getContext('2d');
    if (ctx) {
      const centerX = overviewChartElement.width / 2;
      const centerY = overviewChartElement.height / 2;
      
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#1f2937';
      ctx.fillText('Balance', centerX, centerY - 15);
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = balance >= 0 ? '#10b981' : '#ef4444';
      ctx.fillText(`$${balance.toFixed(2)}`, centerX, centerY + 15);
    }
  } catch (error) {
    console.error('Error adding center text to chart:', error);
  }
}

/**
 * Initialize Savings Trend Chart
 */
function initializeSavingsTrendChart() {
  const savingsTrendElement = document.getElementById('savingsTrendChart');
  if (!savingsTrendElement) return;

  // Destroy any existing chart instance
  const existingChart = Chart.getChart(savingsTrendElement);
  if (existingChart) {
    existingChart.destroy();
  }
  
  const labels = JSON.parse(savingsTrendElement.dataset.labels || '[]');
  const values = JSON.parse(savingsTrendElement.dataset.values || '[]');
  
  new Chart(savingsTrendElement, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Savings Progress',
        data: values,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '₹' + value;
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return '₹' + context.raw;
            }
          }
        }
      }
    }
  });
}

/**
 * Initialize modal functionality
 */
function initializeModals() {
  // Get all modal triggers
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
  
  // Add click event to all modal triggers
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.dataset.modalTarget;
      const modal = document.getElementById(modalId);
      
      if (modal) {
        modal.classList.add('show');
      }
    });
  });
  
  // Add click event to all close buttons
  modalCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      
      if (modal) {
        modal.classList.remove('show');
      }
    });
  });
  
  // Close modal when clicking outside content
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('show');
    }
  });
}

/**
 * Initialize delete confirmation functionality
 */
function initializeDeleteButtons() {
  const deleteButtons = document.querySelectorAll('.delete-btn');
  
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      if (!confirm('Are you sure you want to delete this item?')) {
        e.preventDefault();
      }
    });
  });
}

/**
 * Format currency display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Format date display
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

/**
 * Initialize tooltips for elements with data-tooltip attribute
 */
function initializeTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  tooltipElements.forEach(element => {
    element.setAttribute('title', element.dataset.tooltip);
    
    // Add event listeners for showing/hiding simple tooltips
    element.addEventListener('mouseenter', function() {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = this.getAttribute('title');
      
      document.body.appendChild(tooltip);
      
      const rect = this.getBoundingClientRect();
      tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
      tooltip.style.left = (rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)) + 'px';
      tooltip.style.opacity = '1';
      
      this.tooltip = tooltip;
    });
    
    element.addEventListener('mouseleave', function() {
      if (this.tooltip) {
        document.body.removeChild(this.tooltip);
        this.tooltip = null;
      }
    });
  });
}

/**
 * Initialize datatable functionality if needed
 */
function initializeDataTables() {
  // This is a placeholder for when you need to implement data tables
  // No implementation needed at this time since we're handling tables without a library
}

/**
 * Setup expense form functionality
 */
function setupExpenseForm() {
  // This is a placeholder for expense form functionality
  // No implementation needed at this time
}

// Initialize all the necessary components for the dashboard
function initializeApp() {
  // Check if we're on a page with charts before initializing
  const hasCharts = document.getElementById('expenseChart') || 
                   document.getElementById('incomeChart') || 
                   document.getElementById('expenseTrendChart') ||
                   document.getElementById('expenseCategoryChart') ||
                   document.getElementById('incomeSourceChart') ||
                   document.getElementById('savingsTrendChart') ||
                   document.getElementById('financialOverviewChart');
  
  if (hasCharts) {
    // Initialize Charts
    initializeCharts();
  }
  
  // Initialize any other functionality
  initializeTooltips();
  
  // Only initialize on pages that need them
  const hasDataTables = document.querySelector('.data-table');
  if (hasDataTables) {
    initializeDataTables();
  }
  
  // Only initialize on pages with expense forms
  const hasExpenseForm = document.getElementById('expenseForm');
  if (hasExpenseForm) {
    setupExpenseForm();
  }
} 