# Netlify Functions - API Proxy

This directory contains Netlify Functions that act as a proxy between your frontend and your HTTP API.

## How it works

1. **Frontend** (HTTPS) → **Netlify Functions** (HTTPS) → **Your API** (HTTP)
2. The function receives requests from your frontend and forwards them to your EC2 API
3. This eliminates mixed content errors since all frontend communication is over HTTPS

## Files

- `api-proxy.ts` - Main proxy function that handles all API requests
- `netlify.toml` - Configuration file that routes `/api/*` requests to this function

## Testing locally

To test the function locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Start the dev server
netlify dev
```

## Deployment

When you deploy to Netlify, the function will automatically be available at:
`https://your-site.netlify.app/.netlify/functions/api-proxy`

The redirect in `netlify.toml` makes it accessible at:
`https://your-site.netlify.app/api/*`

## Environment Variables

You can set environment variables in your Netlify dashboard to configure the API URL if needed. 