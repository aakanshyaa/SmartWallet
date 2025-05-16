/**
 * Smart Wallet - Income Page Scripts
 */

// Define showDeleteModal function in the global scope (only if not already defined)
if (typeof window.showDeleteModal !== 'function') {
  window.showDeleteModal = function(incomeId) {
    // Set the income ID in the hidden field
    document.getElementById('deleteIncomeId').value = incomeId;
    
    // Show the delete confirmation modal
    document.getElementById('deleteIncomeModal').classList.add('show');
  };
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Chart.js Income Chart
  initIncomeChart();
  
  // Setup modals and event listeners
  setupModalEvents();
});

/**
 * Initialize the income chart with data
 */
function initIncomeChart() {
  const incomeChartCanvas = document.getElementById('incomeChart');
  
  if (!incomeChartCanvas) return;
  
  // Destroy any existing chart instance to avoid "Canvas is already in use" error
  const existingChart = Chart.getChart(incomeChartCanvas);
  if (existingChart) {
    existingChart.destroy();
  }
  
  const labels = JSON.parse(incomeChartCanvas.getAttribute('data-labels') || '[]');
  const values = JSON.parse(incomeChartCanvas.getAttribute('data-values') || '[]');
  
  // Use Chart.js to create a line chart with daily income data
  new Chart(incomeChartCanvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Daily Income',
        data: values,
        fill: {
          target: 'origin',
          above: 'rgba(59, 130, 246, 0.1)'
        },
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        tension: 0.3
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
              size: 12
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          titleFont: {
            size: 12
          },
          bodyFont: {
            size: 12
          },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              return `Income: ₹${context.raw.toFixed(2)}`;
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
              size: 11
            },
            color: '#64748b'
          },
          title: {
            display: true,
            text: 'Income Amount (₹)',
            color: '#334155',
            font: {
              size: 12,
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
              size: 10
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
              size: 12,
              weight: 'bold'
            },
            padding: {top: 10, bottom: 0}
          }
        }
      },
      hover: {
        mode: 'index',
        intersect: false
      },
      animation: {
        duration: 1000,
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
  const addIncomeBtn = document.getElementById('addIncomeBtn');
  const addIncomeModal = document.getElementById('addIncomeModal');
  const deleteIncomeModal = document.getElementById('deleteIncomeModal');
  const closeModalBtns = document.querySelectorAll('.modal-header .close-modal');
  const cancelModalBtns = document.querySelectorAll('.modal-footer .cancel-modal, button.cancel-modal');
  const selectedIconContainer = document.querySelector('.selected-icon-container');
  const iconOptions = document.querySelector('.icon-options');
  const iconItems = document.querySelectorAll('.icon-item');
  const selectedIconInput = document.getElementById('selectedIcon');
  const iconSearch = document.getElementById('iconSearch');
  const noSearchResults = document.querySelector('.no-search-results');
  
  // Open Add Income modal
  if (addIncomeBtn) {
    addIncomeBtn.addEventListener('click', function() {
      addIncomeModal.classList.add('show');
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
  
  // Add direct event handler for the specific Cancel button in Add Income modal
  const specificCancelBtn = document.querySelector('#addIncomeModal .modal-footer button.cancel-modal');
  if (specificCancelBtn) {
    specificCancelBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      addIncomeModal.classList.remove('show');
    });
  }
  
  // Add direct event handler for the specific X button in Add Income modal
  const specificCloseBtn = document.querySelector('#addIncomeModal .modal-header .close-modal');
  if (specificCloseBtn) {
    specificCloseBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      addIncomeModal.classList.remove('show');
    });
  }
  
  // Toggle icon selection
  if (selectedIconContainer) {
    selectedIconContainer.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event from bubbling to window
      iconOptions.classList.toggle('hidden');
      
      // Clear search when opening
      if (!iconOptions.classList.contains('hidden') && iconSearch) {
        iconSearch.value = '';
        iconSearch.focus();
        // Show all icons
        iconItems.forEach(item => {
          item.style.display = 'flex';
        });
        // Hide no results message
        if (noSearchResults) {
          noSearchResults.classList.add('hidden');
        }
      }
    });
  }
  
  // Select icon
  iconItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event from bubbling
      
      // Remove selected class from all icons
      iconItems.forEach(i => i.classList.remove('selected'));
      // Add selected class to clicked icon
      this.classList.add('selected');
      
      const icon = this.getAttribute('data-icon');
      const title = this.getAttribute('title') || '';
      selectedIconInput.value = icon;
      
      // Update the source field if it's empty or matches a previous icon name
      const sourceInput = document.getElementById('source');
      if (sourceInput && (sourceInput.value.trim() === '' || 
          sourceInput.value === '324er3tg' || 
          isSourceSameAsIcon(sourceInput.value))) {
        sourceInput.value = title || icon.charAt(0).toUpperCase() + icon.slice(1).replace(/-/g, ' ');
      }
      
      // Update the selected icon display
      const selectedIcon = document.querySelector('.selected-icon');
      if (selectedIcon) {
        selectedIcon.innerHTML = `<i class="fas fa-${icon}"></i>`;
      }
      
      // Update the label text
      const iconLabel = document.querySelector('.icon-label');
      if (iconLabel) {
        iconLabel.textContent = title || icon.charAt(0).toUpperCase() + icon.slice(1).replace(/-/g, ' ');
      }
      
      // Close the dropdown after selection
      iconOptions.classList.add('hidden');
    });
  });
  
  // Helper function to check if source input value matches any icon name
  function isSourceSameAsIcon(sourceValue) {
    let isIconName = false;
    document.querySelectorAll('.icon-item').forEach(iconItem => {
      const iconDataName = iconItem.getAttribute('data-icon');
      if (sourceValue.toLowerCase() === iconDataName || 
          sourceValue.toLowerCase() === iconItem.getAttribute('title')?.toLowerCase()) {
        isIconName = true;
      }
    });
    return isIconName;
  }
  
  // Set up delete buttons to show the modal
  const deleteBtns = document.querySelectorAll('.action-button.delete');
  if (deleteBtns) {
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const id = this.getAttribute('data-id');
        if (id) {
          // Set the income ID in the hidden field
          document.getElementById('deleteIncomeId').value = id;
          
          // Show the delete confirmation modal
          deleteIncomeModal.classList.add('show');
        }
      });
    });
  }
  
  // Handle the delete form submission via AJAX
  const deleteForm = document.getElementById('deleteIncomeForm');
  if (deleteForm) {
    deleteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const incomeId = document.getElementById('deleteIncomeId').value;
      if (!incomeId) {
        console.error('No income ID found');
        return;
      }
      
      // Send AJAX request to delete the income
      fetch(`/income/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `_method=DELETE&incomeId=${incomeId}`
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
        deleteIncomeModal.classList.remove('show');
        
        // Remove the income item from the DOM
        const deleteBtn = document.querySelector(`.action-button.delete[data-id="${incomeId}"]`);
        if (deleteBtn) {
          const incomeItem = deleteBtn.closest('.income-source-item');
          if (incomeItem) {
            incomeItem.remove();
            
            // Update the count in the footer
            const countElement = document.querySelector('.sources-count');
            if (countElement) {
              const currentCount = parseInt(countElement.textContent);
              if (!isNaN(currentCount)) {
                countElement.textContent = `${currentCount - 1} income sources`;
              }
            }
            
            // If no income sources left, show empty state
            const incomesList = document.querySelector('.income-sources-list');
            if (incomesList && incomesList.querySelectorAll('.income-source-item').length === 0) {
              incomesList.innerHTML = `
                <div class="empty-state">
                  <p>No income records found. Add your first income!</p>
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
        console.error('Error deleting income:', error);
        alert('There was an error deleting the income. Please try again.');
      });
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal') && event.target.classList.contains('show')) {
      event.target.classList.remove('show');
    }
    
    // Close icon options when clicking outside
    if (!event.target.closest('.icon-selector') && iconOptions && !iconOptions.classList.contains('hidden')) {
      iconOptions.classList.add('hidden');
    }
  });
  
  // Setup icon search
  if (iconSearch) {
    iconSearch.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      let foundResults = false;
      
      iconItems.forEach(item => {
        const icon = item.getAttribute('data-icon');
        const title = item.getAttribute('title')?.toLowerCase() || '';
        
        if (icon.includes(searchTerm) || title.includes(searchTerm)) {
          item.style.display = 'flex';
          foundResults = true;
        } else {
          item.style.display = 'none';
        }
      });
      
      // Show or hide the "no results" message
      if (noSearchResults) {
        if (searchTerm && !foundResults) {
          noSearchResults.classList.remove('hidden');
        } else {
          noSearchResults.classList.add('hidden');
        }
      }
    });
    
    // Prevent the dropdown from closing when clicking in the search box
    iconSearch.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
} 