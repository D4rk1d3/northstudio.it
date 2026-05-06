/**
 * ADMIN-AUTH.JS
 * Admin authentication and dashboard data loading
 * Handles login, session management, and Supabase data display
 */

const ADMIN_PASSWORD = 'northstudio2026';

function initAdminAuth() {
  const loginScreen = document.getElementById('login-screen');
  const dashboard = document.getElementById('dashboard');
  const loginForm = document.querySelector('.login-form');
  const passwordInput = document.querySelector('.login-group input[type="password"]');
  const errorMsg = document.querySelector('.login-err');
  const logoutBtn = document.querySelector('.btn-logout');

  if (!loginScreen || !dashboard) return;

  const TOKEN_KEY = 'admin-token';
  const TOKEN_EXPIRY_KEY = 'admin-token-expiry';

  // Check if user is already logged in
  function checkAuth() {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

    if (token && expiry && new Date().getTime() < parseInt(expiry)) {
      showDashboard();
      loadDashboardData();
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      showLogin();
    }
  }

  // Show login screen
  function showLogin() {
    loginScreen.style.display = 'flex';
    dashboard.style.display = 'none';
  }

  // Show dashboard
  function showDashboard() {
    loginScreen.style.display = 'none';
    dashboard.style.display = 'block';
  }

  // Handle login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const password = passwordInput.value;
      if (!password) {
        showError('Please enter a password');
        return;
      }

      if (password === ADMIN_PASSWORD) {
        localStorage.setItem(TOKEN_KEY, 'admin-session');
        localStorage.setItem(TOKEN_EXPIRY_KEY, new Date().getTime() + 24 * 60 * 60 * 1000);
        showDashboard();
        loadDashboardData();
        passwordInput.value = '';
        clearError();
      } else {
        showError('Password errata');
      }
    });
  }

  // Handle logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      showLogin();
      if (loginForm) loginForm.reset();
    });
  }

  // Show error message
  function showError(message) {
    if (errorMsg) {
      errorMsg.textContent = message;
    }
  }

  // Clear error message
  function clearError() {
    if (errorMsg) {
      errorMsg.textContent = '';
    }
  }

  // Load dashboard data from Supabase
  async function loadDashboardData() {
    try {
      const [visits, leads] = await Promise.all([
        supabase.getVisits(),
        supabase.getLeads()
      ]);

      const statVisits = document.getElementById('stat-visits');
      if (statVisits) statVisits.textContent = visits.length.toLocaleString();

      const statLeads = document.getElementById('stat-leads');
      if (statLeads) statLeads.textContent = leads.length;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const visits30 = visits.filter(v => new Date(v.created_at) >= thirtyDaysAgo);
      const statVisits30 = document.getElementById('stat-visits-30');
      if (statVisits30) statVisits30.textContent = visits30.length.toLocaleString();

      const uniqueIPs = new Set(visits.map(v => v.ip_address).filter(Boolean));
      const statUnique = document.getElementById('stat-unique');
      if (statUnique) statUnique.textContent = uniqueIPs.size;

      loadLeadsTable(leads.slice(0, 10));
      loadVisitsChart(visits);

      const leadsCount = document.querySelector('.leads-count');
      if (leadsCount) leadsCount.textContent = leads.length;
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  // Load leads into table
  function loadLeadsTable(leads) {
    const tbody = document.getElementById('leads-table');
    if (!tbody) return;

    tbody.innerHTML = '';

    leads.forEach((lead) => {
      const row = document.createElement('tr');
      const date = new Date(lead.created_at).toLocaleDateString('it-IT');
      const status = lead.id % 3 === 0 ? 'Nuovo' : lead.id % 3 === 1 ? 'Risposto' : 'In Progress';

      row.innerHTML = `
        <td>${lead.nome || 'N/A'}</td>
        <td>${lead.email || 'N/A'}</td>
        <td>${lead.servizio || 'N/A'}</td>
        <td>${date}</td>
        <td><span class="badge">${status}</span></td>
      `;
      tbody.appendChild(row);
    });
  }

  // Load visits chart
  function loadVisitsChart(visits) {
    // Group visits by date (last 7 days)
    const today = new Date();
    const last7Days = {};

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7Days[dateStr] = 0;
    }

    visits.forEach((visit) => {
      const date = visit.data || visit.created_at.split('T')[0];
      if (last7Days.hasOwnProperty(date)) {
        last7Days[date]++;
      }
    });

    // Update chart bars
    const bars = document.querySelectorAll('.bar-col .bar');
    const values = Object.values(last7Days);
    const maxValue = Math.max(...values, 1);

    bars.forEach((bar, index) => {
      const percentage = (values[index] / maxValue) * 90;
      bar.style.height = Math.round(percentage) + 'px';
    });
  }

  // Initialize
  checkAuth();
}

// Initialize auth when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminAuth);
} else {
  initAdminAuth();
}
