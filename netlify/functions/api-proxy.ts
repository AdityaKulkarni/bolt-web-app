import { Handler, HandlerEvent } from '@netlify/functions';

const API_BASE_URL = 'http://ec2-18-144-65-149.us-west-1.compute.amazonaws.com:3000';

const handler: Handler = async (event: HandlerEvent) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Extract the path from the event
    const path = event.path.replace('/.netlify/functions/api-proxy', '');
    const url = `${API_BASE_URL}${path}`;

    // Get query parameters
    const queryString = event.queryStringParameters 
      ? '?' + new URLSearchParams(event.queryStringParameters as Record<string, string>).toString()
      : '';

    // Prepare headers for the API request
    const apiHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Forward authorization header if present
    if (event.headers.authorization) {
      apiHeaders.Authorization = event.headers.authorization;
    }

    // Make the request to your API
    const response = await fetch(`${url}${queryString}`, {
      method: event.httpMethod,
      headers: apiHeaders,
      body: event.body || undefined,
    });

    // Get the response data
    const data = await response.text();
    
    // Try to parse as JSON, fallback to text if it fails
    let responseData;
    try {
      responseData = JSON.parse(data);
    } catch {
      responseData = data;
    }

    return {
      statusCode: response.status,
      headers: {
        ...headers,
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
      body: typeof responseData === 'string' ? responseData : JSON.stringify(responseData),
    };

  } catch (error) {
    console.error('Proxy error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'Failed to proxy request to API',
      }),
    };
  }
};

export { handler }; 