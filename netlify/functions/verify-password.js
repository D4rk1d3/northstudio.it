exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { password } = JSON.parse(event.body);
    const correctPassword = process.env.ADMIN_PASSWORD || 'northstudio2026';

    if (password === correctPassword) {
      // Generate a simple token
      const token = Buffer.from(Date.now().toString()).toString('base64');
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          token: token,
          message: 'Login successful'
        })
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: 'Invalid password'
        })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Server error'
      })
    };
  }
};
