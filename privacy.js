/**
 * Smart Wallet - Privacy Protection Script
 * Ensures no personal information is displayed in the UI
 */

document.addEventListener('DOMContentLoaded', function() {
  // Replace all user profile sections with generic placeholders
  const userInfoSections = document.querySelectorAll('.user-info');
  
  if (userInfoSections.length) {
    userInfoSections.forEach(section => {
      // Clear any existing content
      section.innerHTML = '<div class="generic-account-menu">Account Menu</div>';

      // Remove all event listeners
      const newSection = section.cloneNode(true);
      section.parentNode.replaceChild(newSection, section);
    });
  }
  
  // Find and remove any visible user information elsewhere
  const possibleInfoElements = document.querySelectorAll(
    '.user-name, .user-email, .profile-info, .user-details, .account-info, ' +
    '.user-settings, .profile-link, .settings-icon, .user-menu-trigger, ' +
    '.user-profile, .account-name, .account-email'
  );
  
  possibleInfoElements.forEach(element => {
    // Replace with generic placeholder or remove completely
    if (element.tagName.toLowerCase() === 'img') {
      // Replace profile images with generic placeholder
      element.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItdXNlciI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djIiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg==';
      element.alt = 'User';
    } else if (element.classList.contains('settings-icon') || 
               element.classList.contains('profile-link') ||
               element.querySelector('.fa-cog')) {
      // Remove settings icons completely
      element.style.display = 'none';
      element.style.visibility = 'hidden';
    } else {
      // Replace text with placeholder
      element.textContent = element.classList.contains('user-name') ? 'User Account' : 
                           (element.classList.contains('user-email') ? '••••••••@••••.com' : 'Account');
    }
  });

  // Prevent copying of any data on the page
  document.addEventListener('copy', function(e) {
    if (e.target.closest('.user-info, .profile-section, .account-section')) {
      e.preventDefault();
      return false;
    }
  });

  // Prevent right-clicks on sensitive areas
  document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('.user-info, .profile-section, .account-section')) {
      e.preventDefault();
      return false;
    }
  });
}); 