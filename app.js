/* ─── AUTH (Google Identity) ─────────────────────────── */
// Replace YOUR_GOOGLE_CLIENT_ID with your actual OAuth client ID
// from https://console.cloud.google.com/ → APIs & Services → Credentials
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

let currentUser = null;

function initAuth() {
  // Try to restore session from localStorage
  const saved = localStorage.getItem('pmo_user');
  if (saved) {
    currentUser = JSON.parse(saved);
    updateAuthUI();
  }

  // Load Google Identity Services
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
        auto_select: false,
      });
    }
  };
  document.head.appendChild(script);
}

function handleGoogleSignIn(response) {
  // Decode JWT
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  currentUser = {
    name: payload.name,
    email: payload.email,
    picture: payload.picture,
    given_name: payload.given_name,
  };
  localStorage.setItem('pmo_user', JSON.stringify(currentUser));
  closeModal();
  updateAuthUI();
  updateAllProgress();
}

function signOut() {
  currentUser = null;
  localStorage.removeItem('pmo_user');
  updateAuthUI();
}

function updateAuthUI() {
  const signinBtn = document.getElementById('btn-signin');
  const userEl = document.getElementById('nav-user');
  if (!signinBtn || !userEl) return;
  if (currentUser) {
    signinBtn.style.display = 'none';
    userEl.style.display = 'flex';
    const img = userEl.querySelector('.nav-avatar');
    const name = userEl.querySelector('.nav-name');
    if (img) img.src = currentUser.picture || '';
    if (name) name.textContent = currentUser.given_name || currentUser.name;
  } else {
    signinBtn.style.display = 'block';
    userEl.style.display = 'none';
  }
}

function openModal() {
  document.getElementById('signin-modal').classList.add('open');
  if (typeof google !== 'undefined' && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
    google.accounts.id.renderButton(
      document.getElementById('google-btn-container'),
      { theme: 'outline', size: 'large', width: 340, text: 'continue_with' }
    );
  }
}
function closeModal() { document.getElementById('signin-modal').classList.remove('open'); }

/* ─── CHECKLIST PERSISTENCE ──────────────────────────── */
function getStorageKey(moduleId, itemIndex) {
  // If user is logged in, scope to their email; else use anonymous
  const userKey = currentUser ? currentUser.email : 'anon';
  return `pmo_${userKey}_${moduleId}_${itemIndex}`;
}

function saveCheck(moduleId, itemIndex, checked) {
  localStorage.setItem(getStorageKey(moduleId, itemIndex), checked ? '1' : '0');
}

function loadCheck(moduleId, itemIndex) {
  const val = localStorage.getItem(getStorageKey(moduleId, itemIndex));
  return val === '1';
}

function initChecklist(moduleId, containerEl, colorClass) {
  const items = containerEl.querySelectorAll('.check-item');
  items.forEach((item, i) => {
    // Load saved state
    if (loadCheck(moduleId, i)) item.classList.add('done');

    item.addEventListener('click', () => {
      item.classList.toggle('done');
      saveCheck(moduleId, i, item.classList.contains('done'));
      updateProgress(moduleId, containerEl);
    });
  });
  updateProgress(moduleId, containerEl);
}

function updateProgress(moduleId, containerEl) {
  const items = containerEl.querySelectorAll('.check-item');
  const done = containerEl.querySelectorAll('.check-item.done').length;
  const total = items.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  // Update sidebar progress bar if it exists
  const bar = document.getElementById(`progress-${moduleId}`);
  const barLabel = document.getElementById(`progress-label-${moduleId}`);
  if (bar) bar.style.width = pct + '%';
  if (barLabel) barLabel.textContent = pct + '%';
}

function updateAllProgress() {
  // Re-initialize all visible checklists after sign-in
  document.querySelectorAll('[data-checklist]').forEach(el => {
    const moduleId = el.dataset.checklist;
    const items = el.querySelectorAll('.check-item');
    items.forEach((item, i) => {
      item.classList.toggle('done', loadCheck(moduleId, i));
    });
    updateProgress(moduleId, el);
  });
}

/* ─── PAGE ROUTING ───────────────────────────────────── */
const PAGES = ['home', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'];
const NAV_MAP = {
  home: 'n-home', m1: 'n-m1', m2: 'n-m2', m3: 'n-m3',
  m4: 'n-m4', m5: 'n-m5', m6: 'n-m6', m7: 'n-m7'
};

function go(id) {
  PAGES.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) { el.style.display = p === id ? 'block' : 'none'; }
    const nav = document.getElementById(NAV_MAP[p]);
    if (nav) nav.classList.toggle('active', p === id);
  });
  document.getElementById('app-root').scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Init checklists on the page we just navigated to
  setTimeout(() => {
    document.querySelectorAll('[data-checklist]').forEach(el => {
      const mid = el.dataset.checklist;
      if (!el.dataset.initialized) {
        el.dataset.initialized = 'true';
        initChecklist(mid, el);
      }
    });
  }, 50);
}

/* ─── INIT ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  // Init visible checklists on load
  document.querySelectorAll('[data-checklist]').forEach(el => {
    el.dataset.initialized = 'true';
    initChecklist(el.dataset.checklist, el);
  });
});
