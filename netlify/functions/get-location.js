const http = require('http');
const https = require('https');

function fetchJson(url) {
  const client = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
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
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  // Prende l'IP dal parametro query o dall'header della richiesta
  const ip =
    event.queryStringParameters?.ip ||
    event.headers['x-forwarded-for']?.split(',')[0].trim() ||
    event.headers['client-ip'] ||
    null;

  if (!ip) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: 'No IP provided' }),
    };
  }

  // ip-api.com: gratuito, no key, max 45 req/min
  // Campi: status, country, countryCode, regionName, city, lat, lon, isp
  try {
    const data = await fetchJson(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,city,regionName,lat,lon`
    );

    if (data.status !== 'success') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: false, city: null, country: null, country_code: null }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        city: data.city || null,
        region: data.regionName || null,
        country: data.country || null,
        country_code: data.countryCode || null,
        lat: data.lat || null,
        lon: data.lon || null,
      }),
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: false, city: null, country: null, error: err.message }),
    };
  }
};
