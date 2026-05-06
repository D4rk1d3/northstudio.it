/**
 * Admin Authentication
 * Gestisce il login e la sessione per la pagina admin
 */

class AdminAuth {
  constructor() {
    this.tokenKey = 'north_admin_token';
    this.tokenExpiryKey = 'north_admin_token_expiry';
    this.loginForm = document.getElementById('login-form');
    this.passwordInput = document.getElementById('password');
    this.loginBtn = document.getElementById('login-btn');
    this.loginErr = document.getElementById('login-err');
    this.loginScreen = document.getElementById('login-screen');
    this.dashboard = document.getElementById('dashboard');
    this.logoutBtn = document.getElementById('btn-logout');

    this.init();
  }

  init() {
    // Controlla se l'utente è già autenticato
    if (this.isAuthenticated()) {
      this.showDashboard();
    } else {
      this.showLoginScreen();
    }

    // Event listeners
    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    if (this.logoutBtn) {
      this.logoutBtn.addEventListener('click', () => this.logout());
    }

    // Pulisci errore quando l'utente digita
    if (this.passwordInput) {
      this.passwordInput.addEventListener('input', () => {
        this.clearError();
      });
    }
  }

  /**
   * Verifica se il token è valido e non scaduto
   */
  isAuthenticated() {
    const token = localStorage.getItem(this.tokenKey);
    const expiry = localStorage.getItem(this.tokenExpiryKey);

    if (!token || !expiry) {
      return false;
    }

    // Controlla se il token è scaduto
    if (Date.now() > parseInt(expiry)) {
      this.clearAuth();
      return false;
    }

    return true;
  }

  /**
   * Gestisce il submit del form di login
   */
  async handleLogin(e) {
    e.preventDefault();

    const password = this.passwordInput.value.trim();

    if (!password) {
      this.showError('Inserisci la password');
      return;
    }

    // Disabilita il bottone durante la richiesta
    this.loginBtn.disabled = true;
    this.loginBtn.textContent = 'Verifica in corso...';

    try {
      const response = await fetch('/.netlify/functions/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Salva il token
        localStorage.setItem(this.tokenKey, data.token);
        
        // Salva la scadenza (24 ore da ora)
        const expiry = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem(this.tokenExpiryKey, expiry.toString());

        // Mostra la dashboard
        this.showDashboard();
      } else {
        this.showError(data.error || 'Errore di autenticazione');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showError('Errore di connessione. Riprova.');
    } finally {
      // Riabilita il bottone
      this.loginBtn.disabled = false;
      this.loginBtn.textContent = 'Accedi';
    }
  }

  /**
   * Mostra la schermata di login
   */
  showLoginScreen() {
    if (this.loginScreen) {
      this.loginScreen.style.display = 'flex';
    }
    if (this.dashboard) {
      this.dashboard.style.display = 'none';
    }
  }

  /**
   * Mostra la dashboard
   */
  showDashboard() {
    if (this.loginScreen) {
      this.loginScreen.style.display = 'none';
    }
    if (this.dashboard) {
      this.dashboard.style.display = 'block';
    }
  }

  /**
   * Mostra messaggio di errore
   */
  showError(message) {
    if (this.loginErr) {
      this.loginErr.textContent = message;
      this.loginErr.style.display = 'block';
    }
  }

  /**
   * Pulisce il messaggio di errore
   */
  clearError() {
    if (this.loginErr) {
      this.loginErr.textContent = '';
      this.loginErr.style.display = 'none';
    }
  }

  /**
   * Logout
   */
  logout() {
    this.clearAuth();
    this.showLoginScreen();
    if (this.passwordInput) {
      this.passwordInput.value = '';
    }
  }

  /**
   * Pulisce i dati di autenticazione
   */
  clearAuth() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpiryKey);
  }
}

// Inizializza quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
  new AdminAuth();
});
