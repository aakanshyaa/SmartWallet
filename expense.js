/**
 * Smart Wallet - Expense Page Scripts
 */

// Define showDeleteModal function in the global scope (only if not already defined)
if (typeof window.showDeleteModal !== 'function') {
  window.showDeleteModal = function(expenseId) {
    // Set the expense ID in the hidden field
    document.getElementById('deleteExpenseId').value = expenseId;
    
    // Show the delete confirmation modal
    document.getElementById('deleteExpenseModal').classList.add('show');
  };
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Chart.js Expense Chart
  initExpenseChart();
  
  // Setup modals and event listeners
  setupModalEvents();
});

/**
 * Initialize the expense chart with data
 */
function initExpenseChart() {
  const expenseChartCanvas = document.getElementById('expenseChart');
  
  if (!expenseChartCanvas) return;
  
  // Destroy any existing chart instance to avoid "Canvas is already in use" error
  const existingChart = Chart.getChart(expenseChartCanvas);
  if (existingChart) {
    existingChart.destroy();
  }
  
  const labels = JSON.parse(expenseChartCanvas.getAttribute('data-labels') || '[]');
  const values = JSON.parse(expenseChartCanvas.getAttribute('data-values') || '[]');
  
  // Create gradient fill
  const ctx = expenseChartCanvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(153, 102, 255, 0.5)');
  gradient.addColorStop(1, 'rgba(153, 102, 255, 0.0)');
  
  // Use Chart.js to create a line chart for daily expenses
  new Chart(expenseChartCanvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Expenses',
        data: values,
        fill: true,
        backgroundColor: gradient,
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 3,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: 'rgba(153, 102, 255, 1)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: 'rgba(153, 102, 255, 1)',
        pointHoverBorderWidth: 3,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 14
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          titleFont: {
            size: 14
          },
          bodyFont: {
            size: 14
          },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              return `Expense: ₹${context.raw.toFixed(2)}`;
            },
            title: function(tooltipItems) {
              return `Date: ${tooltipItems[0].label}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            callback: function(value) {
              return '₹' + value;
            },
            font: {
              size: 12
            },
            color: '#64748b'
          },
          title: {
            display: true,
            text: 'Expense Amount (₹)',
            color: '#334155',
            font: {
              size: 14,
              weight: 'bold'
            },
            padding: {top: 10, bottom: 10}
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 12
            },
            color: '#64748b',
            maxRotation: 45,
            minRotation: 45
          },
          title: {
            display: true,
            text: 'Date',
            color: '#334155',
            font: {
              size: 14,
              weight: 'bold'
            },
            padding: {top: 10, bottom: 0}
          }
        }
      },
      elements: {
        line: {
          tension: 0.4
        }
      },
      hover: {
        mode: 'index',
        intersect: false
      },
      animation: {
        duration: 1200,
        easing: 'easeOutQuart'
      }
    }
  });
}

/**
 * Setup modal events and functionality
 */
function setupModalEvents() {
  // Modal elements
  const addExpenseBtn = document.getElementById('addExpenseBtn');
  const addExpenseModal = document.getElementById('addExpenseModal');
  const deleteExpenseModal = document.getElementById('deleteExpenseModal');
  const closeModalBtns = document.querySelectorAll('.modal-header .close-modal');
  const cancelModalBtns = document.querySelectorAll('.modal-footer .cancel-modal, button.cancel-modal');
  const selectedIconContainer = document.querySelector('.selected-icon-container');
  const iconOptions = document.querySelector('.icon-options');
  const iconItems = document.querySelectorAll('.icon-item');
  const selectedIconInput = document.getElementById('selectedIcon');
  const iconSearch = document.getElementById('iconSearch');
  
  // Open Add Expense modal
  if (addExpenseBtn) {
    addExpenseBtn.addEventListener('click', function() {
      addExpenseModal.classList.add('show');
    });
  }
  
  // Close modals using X buttons
  if (closeModalBtns) {
    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const modal = this.closest('.modal');
        if (modal) {
          modal.classList.remove('show');
        }
      });
    });
  }
  
  // Close modals using Cancel buttons
  if (cancelModalBtns) {
    cancelModalBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const modal = this.closest('.modal');
        if (modal) {
          modal.classList.remove('show');
        }
      });
    });
  }
  
  // Add direct event handler for the specific Cancel button in Add Expense modal
  const specificCancelBtn = document.querySelector('#addExpenseModal .modal-footer button.cancel-modal');
  if (specificCancelBtn) {
    specificCancelBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      addExpenseModal.classList.remove('show');
    });
  }
  
  // Add direct event handler for the specific X button in Add Expense modal
  const specificCloseBtn = document.querySelector('#addExpenseModal .modal-header .close-modal');
  if (specificCloseBtn) {
    specificCloseBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      addExpenseModal.classList.remove('show');
    });
  }
  
  // Toggle icon selection
  if (selectedIconContainer) {
    selectedIconContainer.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent the click from propagating
      iconOptions.classList.toggle('hidden');
      
      // Set the currently selected icon
      const currentIcon = selectedIconInput.value;
      iconItems.forEach(item => {
        const itemIcon = item.getAttribute('data-icon');
        if (itemIcon === currentIcon) {
          item.classList.add('selected');
        } else {
          item.classList.remove('selected');
        }
      });
    });
  }
  
  // Close icon selection when clicking outside
  document.addEventListener('click', function(e) {
    if (iconOptions && !iconOptions.classList.contains('hidden')) {
      // Check if the click is outside the icon selector
      if (!e.target.closest('.icon-selector')) {
        iconOptions.classList.add('hidden');
      }
    }
  });
  
  // Prevent clicks inside the dropdown from closing it
  if (iconOptions) {
    iconOptions.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  
  // Select icon
  iconItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent the click from bubbling up
      const icon = this.getAttribute('data-icon');
      const title = this.getAttribute('title') || '';
      
      // Update selection state
      iconItems.forEach(i => i.classList.remove('selected'));
      this.classList.add('selected');
      
      // Update hidden input value
      selectedIconInput.value = icon;
      
      // Update the category field if it's empty or matches a previous icon name
      const categoryInput = document.getElementById('category');
      if (categoryInput && (categoryInput.value.trim() === '' || 
          categoryInput.value === '324er3tg' || 
          isIconName(categoryInput.value))) {
        categoryInput.value = title || icon.charAt(0).toUpperCase() + icon.slice(1).replace(/-/g, ' ');
      }
      
      // Update the visible icon
      const iconElement = selectedIconContainer.querySelector('.selected-icon i');
      if (iconElement) {
        iconElement.className = `fas fa-${icon}`;
        
        // Update the label to show the selected category
        const labelElement = selectedIconContainer.querySelector('.icon-label');
        if (labelElement) {
          labelElement.textContent = title || icon.charAt(0).toUpperCase() + icon.slice(1).replace(/-/g, ' ');
        }
      }
      
      // Delay hiding the dropdown slightly for a better user experience
      setTimeout(() => {
        iconOptions.classList.add('hidden');
      }, 100);
    });
  });
  
  // Helper function to check if a value matches any icon name
  function isIconName(value) {
    if (!value) return false;
    
    value = value.toLowerCase().trim();
    let result = false;
    
    iconItems.forEach(item => {
      const dataIcon = item.getAttribute('data-icon');
      const iconTitle = item.getAttribute('title') || '';
      
      if (value === dataIcon.toLowerCase() || 
          value === iconTitle.toLowerCase() ||
          iconTitle.toLowerCase().includes(value) ||
          dataIcon.toLowerCase().includes(value)) {
        result = true;
      }
    });
    
    return result;
  }
  
  // Set up delete buttons to show the modal
  const deleteBtns = document.querySelectorAll('.action-button.delete');
  if (deleteBtns) {
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const id = this.getAttribute('data-id');
        if (id) {
          // Set the expense ID in the hidden field
          document.getElementById('deleteExpenseId').value = id;
          
          // Show the delete confirmation modal
          deleteExpenseModal.classList.add('show');
        }
      });
    });
  }
  
  // Handle the delete form submission via AJAX
  const deleteForm = document.getElementById('deleteExpenseForm');
  if (deleteForm) {
    deleteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const expenseId = document.getElementById('deleteExpenseId').value;
      if (!expenseId) {
        console.error('No expense ID found');
        return;
      }
      
      // Send AJAX request to delete the expense
      fetch(`/expense/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `_method=DELETE&expenseId=${expenseId}`
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text().then(text => {
          try {
            // Try to parse as JSON
            return JSON.parse(text);
          } catch (e) {
            // If not JSON, return a success object
            return { success: true };
          }
        });
      })
      .then(data => {
        console.log('Delete successful:', data);
        
        // Close the modal
        deleteExpenseModal.classList.remove('show');
        
        // Remove the expense item from the DOM
        const deleteBtn = document.querySelector(`.action-button.delete[data-id="${expenseId}"]`);
        if (deleteBtn) {
          const expenseItem = deleteBtn.closest('.expense-source-item');
          if (expenseItem) {
            expenseItem.remove();
            
            // Update the count in the footer
            const countElement = document.querySelector('.sources-count');
            if (countElement) {
              const currentCount = parseInt(countElement.textContent);
              if (!isNaN(currentCount)) {
                countElement.textContent = `${currentCount - 1} expenses`;
              }
            }
            
            // If no expenses left, show empty state
            const expensesList = document.querySelector('.expense-sources-list');
            if (expensesList && expensesList.querySelectorAll('.expense-source-item').length === 0) {
              expensesList.innerHTML = `
                <div class="empty-state">
                  <p>No expense records found. Add your first expense!</p>
                </div>
              `;
            }
          }
        } else {
          // If we can't find the element to remove, reload the page
          window.location.reload();
        }
      })
      .catch(error => {
        console.error('Error deleting expense:', error);
        alert('There was an error deleting the expense. Please try again.');
      });
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal') && event.target.classList.contains('show')) {
      event.target.classList.remove('show');
    }
  });
  
  // Setup icon search
  if (iconSearch) {
    iconSearch.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent clicks from closing the dropdown
    });
    
    iconSearch.addEventListener('input', function(e) {
      e.stopPropagation(); // Prevent input from closing the dropdown
      const searchTerm = this.value.toLowerCase().trim();
      
      let hasVisibleItems = false;
      iconItems.forEach(item => {
        const icon = item.getAttribute('data-icon');
        const title = item.getAttribute('title') || '';
        if (icon.includes(searchTerm) || 
            title.toLowerCase().includes(searchTerm) ||
            searchTerm === '') {
          item.style.display = 'flex';
          hasVisibleItems = true;
        } else {
          item.style.display = 'none';
        }
      });
      
      // Show/hide category headers based on whether they have visible items
      const categoryHeaders = document.querySelectorAll('.icon-categories h4');
      categoryHeaders.forEach(header => {
        const nextGrid = header.nextElementSibling;
        if (nextGrid && nextGrid.classList.contains('icon-grid')) {
          const hasVisibleIcon = Array.from(nextGrid.querySelectorAll('.icon-item')).some(
            item => item.style.display !== 'none'
          );
          
          header.style.display = hasVisibleIcon ? 'block' : 'none';
          nextGrid.style.display = hasVisibleIcon ? 'grid' : 'none';
        }
      });
      
      // Show a message if no icons match the search
      let noResultsElement = document.querySelector('.no-search-results');
      if (!hasVisibleItems) {
        if (!noResultsElement) {
          noResultsElement = document.createElement('div');
          noResultsElement.className = 'no-search-results';
          noResultsElement.innerHTML = '<p>No icons match your search</p>';
          document.querySelector('.icon-categories').prepend(noResultsElement);
        }
        noResultsElement.style.display = 'block';
      } else if (noResultsElement) {
        noResultsElement.style.display = 'none';
      }
    });
    
    // Clear search when dropdown opens
    selectedIconContainer.addEventListener('click', function() {
      iconSearch.value = '';
      // Trigger input event to show all icons
      const inputEvent = new Event('input', { bubbles: true });
      iconSearch.dispatchEvent(inputEvent);
    });
  }
} 