// API Configuration
export const API_BASE_URL = 'https://bolt-hackathon-backend-adityakulkarnis-projects.vercel.app';

// API Endpoints
export const API_ENDPOINTS = {
  SIGNUP: '/user',
  LOGIN: '/login',
  LOGOUT: '/logout',
  PROFILE: '/profile',
  CONTACTS: '/contacts',
  CONTACT: '/contact',
  TRUSTED_CONTACT: '/trusted-contact',
  TRUSTED_CONTACTS: '/trusted-contacts',
} as const;

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const; 