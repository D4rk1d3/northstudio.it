# North Studio — Sito Web Professionale

Sito creativo con autenticazione backend per la dashboard admin.

## 📋 Struttura del Progetto

```
northstudio/
├── css/
│   ├── base.css          # Variabili, reset, animazioni globali
│   ├── main.css          # Stili pagina principale
│   ├── admin.css         # Stili admin dashboard
│   └── legal.css         # Stili pagine legali
├── js/
│   ├── admin-auth.js     # Autenticazione admin
│   ├── cursor.js         # Cursore personalizzato
│   ├── nav.js            # Navigazione
│   ├── reveal.js         # Scroll animations
│   ├── cookies.js        # Banner cookie
│   └── form.js           # Form contatti
├── functions/
│   └── verify-password.js # Netlify Function per login
├── index.html            # Pagina principale
├── admin.html            # Dashboard admin (protetta)
├── cookie-policy.html    # Cookie policy
├── privacy-policy.html   # Privacy policy
└── netlify.toml          # Configurazione Netlify
```

## 🔐 Autenticazione Admin

**Password**: `northstudio2026`

### Come Funziona

1. Accedi a `/admin.html`
2. Inserisci la password
3. La Netlify Function verifica e genera un token
4. Il token viene salvato in localStorage (24 ore)
5. La dashboard diventa accessibile

### Logout

Clicca il bottone "Logout" nella top bar per pulire la sessione.

## 🚀 Deployment su Netlify

### Prerequisiti
- Account Netlify
- Repository GitHub con il codice

### Passi

1. **Connetti il repository**
   - Vai su netlify.com
   - Clicca "New site from Git"
   - Seleziona il repository

2. **Netlify rileverà automaticamente**
   - `netlify.toml` per la configurazione
   - La cartella `functions/` per le Netlify Functions
   - La password da `ADMIN_PASSWORD` in netlify.toml

3. **Deploy**
   - Clicca "Deploy site"
   - Netlify compilerà e deployerà automaticamente

### Variabili d'Ambiente (Opzionale)

Se vuoi cambiare la password senza modificare il codice:

1. Vai a Site Settings → Build & Deploy → Environment
2. Aggiungi una variabile: `ADMIN_PASSWORD = "tuaPassword"`

## 📱 Responsive Design

Il sito è completamente responsive:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## ✨ Caratteristiche

- ✅ Cursore personalizzato
- ✅ Animazioni scroll reveal
- ✅ Banner cookie GDPR
- ✅ Form contatti
- ✅ Dashboard admin protetta
- ✅ SEO ottimizzato
- ✅ Performance ottimizzato (cache headers)
- ✅ Accessibilità (WCAG)

## 🛠 Tecnologie

- HTML5
- CSS3 (variabili CSS, grid, flexbox)
- JavaScript Vanilla (no framework)
- Netlify Functions (backend)
- localStorage (sessioni)

## 📧 Contatti

- Email: info@northstudio.it
- Telefono: +39 351 7131975
- Instagram: @northstudio.it
- LinkedIn: Pietro Trevisan

---

**© 2026 Pietro Trevisan — North Studio**
