// netlify/functions/verify-admin.js
// La password vera è in Netlify → Site configuration → Environment variables
// come ADMIN_PASSWORD_HASH (bcrypt hash della tua password)
// Genera l'hash con: node -e "require('bcryptjs').hash('TUAPASSWORD', 10).then(console.log)"

const bcrypt = require("bcryptjs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { password } = JSON.parse(event.body || "{}");

  if (!password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, error: "Missing password" }),
    };
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;

  if (!hash) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "Server misconfigured" }),
    };
  }

  const match = await bcrypt.compare(password, hash);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: match }),
  };
};
