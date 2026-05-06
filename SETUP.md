# Setup istruzioni — North Studio

## File aggiunti / modificati

```
├── index.html              ← form contatto + tracker visite aggiunto
├── admin.html              ← pagina analytics (NUOVA)
├── netlify.toml            ← config Netlify Functions (NUOVO)
└── netlify/
    └── functions/
        ├── verify-admin.js ← verifica password lato server (NUOVO)
        └── package.json    ← dipendenza bcryptjs (NUOVO)
```

---

## 1. Sostituisci i placeholder Supabase

In **`index.html`** (sezione contatti + tracker, ~2 occorrenze) e in **`admin.html`**:

```js
const SUPABASE_URL = 'https://TUOPROJECT.supabase.co';   // ← il tuo Project URL
const SUPABASE_ANON_KEY = 'eyJhbGci...';                 // ← la tua anon/public key
```

Trovi entrambi su: Supabase → Settings → API

---

## 2. Configura la password admin su Netlify (NON nel repo)

### Step 1 — genera l'hash bcrypt della tua password

Sul tuo Mac, da terminale:

```bash
node -e "require('bcryptjs').hash('LA_TUA_PASSWORD', 10).then(console.log)"
```

Se bcryptjs non è installato globalmente:

```bash
npm install -g bcryptjs
node -e "const b = require('bcryptjs'); b.hash('LA_TUA_PASSWORD', 10).then(console.log)"
```

Copia l'output (es: `$2a$10$abc...xyz`)

### Step 2 — aggiungi la variabile su Netlify

Netlify → Il tuo sito → **Site configuration** → **Environment variables** → Add variable:

| Key | Value |
|---|---|
| `ADMIN_PASSWORD_HASH` | `$2a$10$abc...xyz` (l'hash generato sopra) |

✅ Questo non finisce mai nel repo Git.

---

## 3. Supabase — RLS (Row Level Security)

Abilita RLS su entrambe le tabelle:

### Tabella `leads`
- **INSERT**: allow for `anon` (chiunque può inviare il form)
- **SELECT**: allow solo per `authenticated` o blocca del tutto (la pagina admin legge con anon key — considera di usare la service_role key nella function invece)

### Tabella `visite`
- **INSERT**: allow for `anon`
- **SELECT**: allow for `anon` (la dashboard legge con anon key)

> **Nota**: se vuoi proteggere anche la lettura dei lead, sposta le fetch di `admin.html` in una Netlify Function che usa la `service_role` key (non esporla mai lato client).

---

## 4. Aggiorna il `.gitignore`

Aggiungi:
```
.env
.env.local
netlify/functions/node_modules/
```

---

## 5. Accesso admin

URL: `https://www.northstudio.it/admin.html`

- La password viene verificata dalla Netlify Function `/.netlify/functions/verify-admin`
- Non è mai in nessun file del repo
- La sessione dura finché non chiudi il tab (sessionStorage)
