document.addEventListener('DOMContentLoaded', function() {
  // Check URL for showAddModal parameter
  const urlParams = new URLSearchParams(window.location.search);
  const shouldShowModal = urlParams.get('showAddModal') === 'true';
  const addSavingModal = document.getElementById('addSavingModal');
  
  if (shouldShowModal && addSavingModal) {
    addSavingModal.classList.add('show');
  }
  
  // Open add savings modal
  const addSavingBtn = document.getElementById('addSavingBtn');
  
  if (addSavingBtn && addSavingModal) {
    addSavingBtn.addEventListener('click', function() {
      addSavingModal.classList.add('show');
    });
  }
  
  // Delete savings confirmation
  const deleteSavingBtns = document.querySelectorAll('.delete-saving');
  const deleteSavingModal = document.getElementById('deleteSavingModal');
  const deleteSavingId = document.getElementById('deleteSavingId');
  const deleteSavingForm = document.getElementById('deleteSavingForm');
  
  if (deleteSavingBtns && deleteSavingModal && deleteSavingId && deleteSavingForm) {
    deleteSavingBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const savingId = this.getAttribute('data-id');
        deleteSavingId.value = savingId;
        deleteSavingForm.action = `/savings/delete/${savingId}`;
        deleteSavingModal.classList.add('show');
      });
    });
  }
  
  // Close modals
  const closeModalBtns = document.querySelectorAll('.close-modal, .cancel-modal');
  
  if (closeModalBtns) {
    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) {
          modal.classList.remove('show');
        }
      });
    });
  }
  
  // Icon selector functionality
  const iconSelectors = document.querySelectorAll('.icon-selector');
  
  if (iconSelectors) {
    iconSelectors.forEach(selector => {
      const selectedIconContainer = selector.querySelector('.selected-icon-container');
      const selectedIcon = selector.querySelector('.selected-icon');
      const iconOptions = selector.querySelector('.icon-options');
      const iconItems = selector.querySelectorAll('.icon-item');
      const selectedIconInput = selector.querySelector('#selectedIcon');
      const iconSearch = selector.querySelector('#iconSearch');
      const noSearchResults = selector.querySelector('.no-search-results');
      
      // Toggle icon options
      if (selectedIconContainer && iconOptions) {
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
      if (iconItems && selectedIcon && selectedIconInput) {
        iconItems.forEach(item => {
          item.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling
            
            // Remove selected class from all icons
            iconItems.forEach(i => i.classList.remove('selected'));
            // Add selected class to clicked icon
            this.classList.add('selected');
            
            const icon = this.getAttribute('data-icon');
            const title = this.getAttribute('title') || '';
            selectedIcon.innerHTML = `<i class="fas fa-${icon}"></i>`;
            selectedIconInput.value = icon;
            
            // Update the label text
            const iconLabel = selector.querySelector('.icon-label');
            if (iconLabel) {
              iconLabel.textContent = title || icon.charAt(0).toUpperCase() + icon.slice(1).replace(/-/g, ' ');
            }
            
            iconOptions.classList.add('hidden');
          });
        });
      }
      
      // Search icons
      if (iconSearch && iconItems) {
        iconSearch.addEventListener('input', function() {
          const searchTerm = this.value.toLowerCase().trim();
          let foundResults = false;
          
          iconItems.forEach(item => {
            const icon = item.getAttribute('data-icon').toLowerCase();
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
    });
  }
  
  // Close icon options when clicking outside
  document.addEventListener('click', function(e) {
    const iconOptions = document.querySelectorAll('.icon-options:not(.hidden)');
    if (iconOptions.length > 0) {
      iconOptions.forEach(option => {
        if (!option.closest('.icon-selector').contains(e.target)) {
          option.classList.add('hidden');
        }
      });
    }
  });
  
  // Auto-fill suggestions for common savings goals
  const nameInput = document.getElementById('name');
  const suggestions = document.getElementById('goalSuggestions');
  
  if (nameInput && suggestions) {
    // Common savings goals
    const savingsGoals = [
      'Emergency Fund',
      'Home Down Payment',
      'Car Purchase',
      'Vacation',
      'Education',
      'Wedding',
      'Retirement',
      'Medical Expenses',
      'Home Renovation',
      'New Tech Gadget',
      'Gift Fund'
    ];
    
    function updateSuggestions() {
      const input = nameInput.value.toLowerCase();
      
      if (input.length > 0) {
        const filteredGoals = savingsGoals.filter(goal => 
          goal.toLowerCase().includes(input)
        );
        
        suggestions.innerHTML = '';
        
        if (filteredGoals.length > 0) {
          suggestions.classList.add('show');
          
          filteredGoals.forEach(goal => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.textContent = goal;
            div.addEventListener('click', () => {
              nameInput.value = goal;
              suggestions.classList.remove('show');
              
              // Also set appropriate icon based on goal
              let iconName = 'piggy-bank';
              const selectedIcon = document.querySelector('.selected-icon i');
              const selectedIconInput = document.getElementById('selectedIcon');
              const iconLabel = document.querySelector('.icon-label');
              
              if (goal.toLowerCase().includes('emergency')) {
                iconName = 'shield-alt';
              } else if (goal.toLowerCase().includes('home')) {
                iconName = 'home';
              } else if (goal.toLowerCase().includes('car')) {
                iconName = 'car';
              } else if (goal.toLowerCase().includes('vacation') || goal.toLowerCase().includes('travel')) {
                iconName = 'plane';
              } else if (goal.toLowerCase().includes('education')) {
                iconName = 'graduation-cap';
              } else if (goal.toLowerCase().includes('wedding')) {
                iconName = 'ring';
              } else if (goal.toLowerCase().includes('retirement')) {
                iconName = 'chart-line';
              } else if (goal.toLowerCase().includes('medical')) {
                iconName = 'heart';
              } else if (goal.toLowerCase().includes('tech') || goal.toLowerCase().includes('gadget')) {
                iconName = 'laptop';
              } else if (goal.toLowerCase().includes('gift')) {
                iconName = 'gift';
              }
              
              if (selectedIcon && selectedIconInput) {
                selectedIcon.className = `fas fa-${iconName}`;
                selectedIconInput.value = iconName;
                
                // Update the label text too
                if (iconLabel) {
                  const title = document.querySelector(`.icon-item[data-icon="${iconName}"]`)?.getAttribute('title');
                  iconLabel.textContent = title || iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-/g, ' ');
                }
              }
            });
            suggestions.appendChild(div);
          });
        } else {
          suggestions.classList.remove('show');
        }
      } else {
        suggestions.classList.remove('show');
      }
    }
    
    nameInput.addEventListener('input', updateSuggestions);
    nameInput.addEventListener('focus', updateSuggestions);
    
    // Hide suggestions when clicking elsewhere
    document.addEventListener('click', function(e) {
      if (e.target !== nameInput && !suggestions.contains(e.target)) {
        suggestions.classList.remove('show');
      }
    });
  }
  
  // Initialize savings trend chart
  const ctxSavings = document.getElementById('savingsTrendChart');
  if (ctxSavings) {
    // Destroy any existing chart instance to avoid "Canvas is already in use" error
    const existingChart = Chart.getChart(ctxSavings);
    if (existingChart) {
      existingChart.destroy();
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      
    // Sample data for demo purposes - in a real app, would be dynamically generated
    const currentData = [500, 1000, 1500, 2000, 2500, 3000];
    const targetData = [5000, 5000, 5000, 5000, 5000, 5000];
    
    new Chart(ctxSavings, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Current Savings',
            data: currentData,
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
          },
          {
            label: 'Target Total',
            data: targetData,
            borderColor: '#e74c3c',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: function(value) {
                return '₹' + value;
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ₹' + context.raw;
              }
            }
          }
        }
      }
    });
  }
}); 