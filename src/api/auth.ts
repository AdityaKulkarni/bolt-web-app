import { API_BASE_URL, API_ENDPOINTS, DEFAULT_HEADERS } from './config';
import { UserRegistrationRequest, UserLoginRequest, LoginResponse, UserProfile, ApiResponse } from './types';

// Helper function to handle API responses
const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (response.ok) {
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } else {
    const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
    return {
      success: false,
      error: errorData.message || 'Request failed',
    };
  }
};

// User Registration
export const registerUser = async (userData: UserRegistrationRequest): Promise<ApiResponse<UserProfile>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SIGNUP}`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(userData),
    });

    return handleApiResponse<UserProfile>(response);
  } catch {
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
};

// User Login
export const loginUser = async (credentials: UserLoginRequest): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(credentials),
    });

    return handleApiResponse<LoginResponse>(response);
  } catch {
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
};

// User Logout
export const logoutUser = async (): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGOUT}`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
    });

    return handleApiResponse<void>(response);
  } catch {
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
};

// Get User Profile
export const getUserProfile = async (): Promise<ApiResponse<UserProfile>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROFILE}`, {
      method: 'GET',
      headers: DEFAULT_HEADERS,
    });

    return handleApiResponse<UserProfile>(response);
  } catch {
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
}; 