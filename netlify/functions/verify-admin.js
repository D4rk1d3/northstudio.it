const crypto = require('crypto');

const attempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const ip = event.headers['x-forwarded-for']?.split(',')[0].trim() || 'unknown';
  const now = Date.now();

  for (const [key, data] of attempts) {
    if (now - data.first > WINDOW_MS) attempts.delete(key);
  }

  const record = attempts.get(ip) || { count: 0, first: now };
  if (record.count >= MAX_ATTEMPTS) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'Too many attempts' }),
    };
  }

  const { password } = JSON.parse(event.body || '{}');
  if (!password) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false }),
    };
  }

  const hash = crypto.createHash('sha256').update(password).digest('hex');
  const ok = hash === process.env.ADMIN_PASSWORD_HASH;

  if (!ok) {
    record.count += 1;
    attempts.set(ip, record);
  } else {
    attempts.delete(ip);
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok }),
  };
};
