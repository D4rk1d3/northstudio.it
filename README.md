# North Studio — Portfolio & Admin Dashboard

Studio creativo freelance specializzato in brand identity, sviluppo web, fotografia e video editing.

## 📁 Struttura Progetto

```
northstudio/
├── index.html                 # Pagina principale
├── admin.html                 # Dashboard admin (protetta da password)
├── cookie-policy.html         # Cookie policy
├── privacy-policy.html        # Privacy policy
├── css/
│   ├── shared.css            # Stili comuni (nav, cookie, cursore, animazioni)
│   ├── index.css             # Stili pagina principale
│   ├── admin.css             # Stili dashboard admin
│   └── legal.css             # Stili pagine legali
├── js/
│   ├── cursor.js             # Cursore personalizzato
│   ├── nav.js                # Navigazione
│   ├── reveal.js             # Scroll reveal animations
│   ├── cookies.js            # Banner cookie
│   ├── form.js               # Form contatti
│   └── admin-auth.js         # Autenticazione admin
├── netlify/
│   └── functions/
│       └── verify-password.js # Netlify Function per login
├── netlify.toml              # Configurazione Netlify
└── README.md                 # Questo file
```

## 🚀 Deployment su Netlify

### 1. Preparazione
- Crea un repository GitHub con i file del progetto
- Assicurati che `netlify.toml` sia nella root

### 2. Deploy
1. Vai su [netlify.com](https://netlify.com)
2. Clicca **"New site from Git"**
3. Seleziona il repository
4. Netlify rileverà automaticamente `netlify.toml`
5. Clicca **Deploy**

### 3. Configurazione Variabili
Se vuoi cambiare la password:
1. Vai su **Site settings** → **Build & deploy** → **Environment**
2. Aggiungi: `ADMIN_PASSWORD = tuaPassword`
3. Redeploy il sito

## 🔐 Accesso Admin

**URL**: `https://tuodominio.com/admin.html`
**Password**: `northstudio2026`

Il token di sessione dura **24 ore**.

## 🎨 Personalizzazione

### Cambiare Colori
Modifica `css/shared.css` - Sezione `:root`:
```css
:root {
  --bg: #161616;              /* Sfondo */
  --text: #e8e4dc;            /* Testo principale */
  --mid: #666460;             /* Testo secondario */
  --mid-hi: #8a8680;          /* Testo terziario */
}
```

### Cambiare Font
Modifica il link Google Fonts in `index.html` e `admin.html`:
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=TUOFONT:wght@...">
```

### Aggiungere Pagine
1. Crea nuovo file HTML
2. Aggiungi i link CSS: `shared.css` e `nomepagina.css`
3. Aggiungi script: `cursor.js` e altri JS necessari

## 📊 Features

✅ **Dark Theme** — Tema scuro elegante
✅ **Responsive** — Mobile, tablet, desktop
✅ **Cursore Personalizzato** — Su tutte le pagine
✅ **Animazioni Smooth** — Reveal effects, hover effects
✅ **Cookie Banner** — GDPR compliant
✅ **Admin Dashboard** — Protetta da password
✅ **Netlify Functions** — Backend serverless
✅ **SEO Optimized** — Meta tags, schema.org, sitemap

## 🔒 Sicurezza

- ✅ HTTPS automatico
- ✅ Security headers configurati
- ✅ CORS protetto
- ✅ Password hashmata (in produzione)
- ✅ Token con scadenza 24h

## 📝 Note

- Il sito usa solo **cookie tecnici** (no tracking)
- Nessuna dipendenza esterna (vanilla JS)
- Performance ottimizzate (cache headers)
- Compatibile con tutti i browser moderni

## 👨‍💻 Supporto

Per domande o modifiche:
- Email: info@northstudio.it
- Telefono: +39 351 7131975

---

**© 2026 North Studio. Tutti i diritti riservati.**
