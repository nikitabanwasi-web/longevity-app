exports.handler = async (event) => {
  console.log('Function invoked, method:', event.httpMethod);

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log('API key found:', !!apiKey);

  if (!apiKey) {
    console.log('ERROR: ANTHROPIC_API_KEY is not set');
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  try {
    const body = JSON.parse(event.body);
    console.log('Calling Anthropic API with model:', body.model);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Anthropic response status:', response.status);

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.log('ERROR:', err.message);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
