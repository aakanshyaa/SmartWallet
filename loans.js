/**
 * Smart Wallet - Loans JavaScript
 * Handles specific loan-related functionality
 */

// Define showDeleteModal function in the global scope (only if not already defined)
if (typeof window.showDeleteModal !== 'function') {
  window.showDeleteModal = function(loanId) {
    // Set the loan ID in the hidden field
    document.getElementById('deleteLoanId').value = loanId;
    
    // Set the form action and show the delete confirmation modal
    const deleteLoanForm = document.getElementById('deleteLoanForm');
    if (deleteLoanForm) {
      deleteLoanForm.action = `/loans/delete/${loanId}`;
    }
    
    document.getElementById('deleteLoanModal').classList.add('show');
  };
}

document.addEventListener('DOMContentLoaded', function() {
  // Set up delete functionality
  setupDeleteFunctionality();
  
  // Loan-specific calculations
  const interestRateInput = document.getElementById('interest_rate');
  const totalAmountInput = document.getElementById('total_amount');
  const remainingAmountInput = document.getElementById('remaining_amount');
  
  if (totalAmountInput && remainingAmountInput) {
    totalAmountInput.addEventListener('change', function() {
      // Set remaining amount equal to total amount by default for new loans
      if (remainingAmountInput.value === '' || parseFloat(remainingAmountInput.value) === 0) {
        remainingAmountInput.value = this.value;
      }
    });
  }
});

/**
 * Set up delete functionality for loans
 */
function setupDeleteFunctionality() {
  // Handle the delete form submission via AJAX
  const deleteLoanForm = document.getElementById('deleteLoanForm');
  
  if (deleteLoanForm) {
    deleteLoanForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const loanId = document.getElementById('deleteLoanId').value;
      if (!loanId) {
        console.error('No loan ID found');
        return;
      }
      
      // Send AJAX request to delete the loan
      fetch(`/loans/delete/${loanId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `loanId=${loanId}`
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        return response.text().then(text => {
          try {
            // Try to parse as JSON
            return JSON.parse(text);
          } catch (e) {
            // If not JSON, return a success object if the response is OK
            return { success: response.ok };
          }
        });
      })
      .then(data => {
        console.log('Delete response:', data);
        
        // Close the modal
        document.getElementById('deleteLoanModal').classList.remove('show');
        
        // Reload the page to reflect the changes
        window.location.reload();
      })
      .catch(error => {
        console.error('Error deleting loan:', error);
        document.getElementById('deleteLoanModal').classList.remove('show');
        alert('There was an error deleting the loan. Please try again.');
      });
    });
  }
  
  // Set up delete buttons to show the modal
  const deleteLoanBtns = document.querySelectorAll('.delete-loan');
  if (deleteLoanBtns) {
    deleteLoanBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const id = this.getAttribute('data-id');
        showDeleteModal(id);
      });
    });
  }
  
  // Set up modal close buttons
  const closeModalBtns = document.querySelectorAll('.modal-header .close-modal');
  const cancelModalBtns = document.querySelectorAll('.cancel-modal');
  
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
} 