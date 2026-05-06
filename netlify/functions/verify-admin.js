// netlify/functions/verify-admin.js
// Usa crypto built-in di Node — zero dipendenze esterne
// Su Netlify → Environment variables imposta:
// ADMIN_PASSWORD_HASH = hash SHA-256 della tua password (vedi sotto come generarlo)

const crypto = require("crypto");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { password } = JSON.parse(event.body || "{}");

  if (!password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false }),
    };
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;

  if (!hash) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: "Server misconfigured" }),
    };
  }

  const inputHash = crypto.createHash("sha256").update(password).digest("hex");
  const match = inputHash === hash;

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: match }),
  };
};