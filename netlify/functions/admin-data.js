const crypto = require('crypto');
const https = require('https');

const SUPABASE_URL = 'bcowedrviohimkljgzhf.supabase.co';

function verifyToken(token) {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD_HASH;
  if (!secret) return false;
  const now = Math.floor(Date.now() / (2 * 3600 * 1000));
  for (const bucket of [now, now - 1]) {
    const expected = crypto.createHmac('sha256', secret).update(String(bucket)).digest('hex');
    try {
      if (crypto.timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'))) return true;
    } catch { /* lunghezza diversa */ }
  }
  return false;
}

function supabaseGet(path) {
  return new Promise((resolve, reject) => {
    https.get({
      hostname: SUPABASE_URL,
      path,
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

exports.handler = async (event) => {
  const token = (event.headers['authorization'] || '').replace('Bearer ', '');
  if (!token || !verifyToken(token)) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Non autorizzato' }),
    };
  }

  try {
    const [visite, leads] = await Promise.all([
      supabaseGet('/rest/v1/visite?select=*&order=created_at.desc'),
      supabaseGet('/rest/v1/leads?select=*&order=created_at.desc'),
    ]);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visite, leads }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
