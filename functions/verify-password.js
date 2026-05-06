/**
 * Netlify Function: verify-password
 * Verifica la password per accedere alla dashboard admin
 * 
 * Endpoint: /.netlify/functions/verify-password
 * Method: POST
 * Body: { password: string }
 * Response: { success: boolean, token?: string, error?: string }
 */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'northstudio2026';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 ore in millisecondi

exports.handler = async (event) => {
  // Solo POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { password } = JSON.parse(event.body);

    // Validazione input
    if (!password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Password required' })
      };
    }

    // Verifica password
    if (password === ADMIN_PASSWORD) {
      // Genera token semplice (timestamp + hash)
      const token = Buffer.from(
        JSON.stringify({
          authenticated: true,
          timestamp: Date.now(),
          expiry: Date.now() + TOKEN_EXPIRY
        })
      ).toString('base64');

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          token: token
        })
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          error: 'Password non corretta'
        })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Server error',
        message: error.message
      })
    };
  }
};
