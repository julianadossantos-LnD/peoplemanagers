/**
 * ==========================================================================
 * PEOPLE MANAGER ONBOARDING SYSTEM CONTROLLER ENGINE
 * ==========================================================================
 */

/**
 * Single-Page Client Side Router Implementation
 * @param {string} pageId - Target view ID path destination
 */
function go(pageId) {
  // Hide all main framework windows instantly
  document.getElementById('page-home').style.display = 'none';
  document.querySelectorAll('.mod-page').forEach(page => page.style.display = 'none');
  
  // Resolve active targeted wrapper container
  if (pageId === 'home') {
    document.getElementById('page-home').style.display = 'block';
  } else {
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) targetPage.style.display = 'block';
  }
  
  // Standard instant top-scroll navigation override pattern reset
  window.scrollTo({ top: 0, behavior: 'instant' });
  
  // Synchronize menu bar active text classes
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.id === `n-${pageId}`) link.classList.add('active');
  });
}

// Interactive Sign-in Overlay Display Modifiers
function openModal() { document.getElementById('signin-modal').classList.add('open'); }
function closeModal() { document.getElementById('signin-modal').classList.remove('open'); }

/**
 * Core Checklist Memory Synchronization Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.checklist-card');
  cards.forEach(card => {
    const trackId = card.getAttribute('data-checklist');
    const items = card.querySelectorAll('.check-item');
    
    items.forEach((item, index) => {
      const memoryKey = `pmo_state_${trackId}_${index}`;
      
      // Load validated client-side browser array states mapping
      if (localStorage.getItem(memoryKey) === 'true') {
        item.classList.add('checked');
      }
      
      // Wire reactive layout item select tap triggers
      item.addEventListener('click', () => {
        item.classList.toggle('checked');
        localStorage.setItem(memoryKey, item.classList.contains('checked'));
      });
    });
  });
});
