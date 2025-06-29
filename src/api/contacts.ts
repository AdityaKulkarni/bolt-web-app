import { API_BASE_URL, API_ENDPOINTS, DEFAULT_HEADERS } from './config';
import { Contact, CreateContactRequest, TrustedContactRequest, TrustedContactResponse, TrustedContactsListResponse, ApiResponse } from './types';

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

// Get All Contacts
export const getContacts = async (): Promise<ApiResponse<Contact[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CONTACTS}`, {
      method: 'GET',
      headers: DEFAULT_HEADERS,
    });

    return handleApiResponse<Contact[]>(response);
  } catch {
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
};

// Create New Contact
export const createContact = async (contactData: CreateContactRequest): Promise<ApiResponse<Contact>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CONTACTS}`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(contactData),
    });

    return handleApiResponse<Contact>(response);
  } catch {
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
};

// Create Trusted Contact with Image Upload
export const createTrustedContact = async (
  contactData: Omit<TrustedContactRequest, 'picture'>,
  imageFile?: File
): Promise<ApiResponse<TrustedContactResponse>> => {
  try {
    const formData = new FormData();
    
    // Add all contact data to form data
    Object.entries(contactData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TRUSTED_CONTACT}`, {
      method: 'POST',
      body: formData, // Don't set Content-Type header for FormData
    });

    return handleApiResponse<TrustedContactResponse>(response);
  } catch {
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
};

// Get Single Contact
export const getContact = async (contactId: string): Promise<ApiResponse<Contact>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CONTACT}/${contactId}`, {
      method: 'GET',
      headers: DEFAULT_HEADERS,
    });

    return handleApiResponse<Contact>(response);
  } catch {
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
};

// Update Contact
export const updateContact = async (contactId: string, contactData: Partial<CreateContactRequest>): Promise<ApiResponse<Contact>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CONTACT}/${contactId}`, {
      method: 'PUT',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(contactData),
    });

    return handleApiResponse<Contact>(response);
  } catch {
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
};

// Get Trusted Contacts by User ID
export const getTrustedContactsByUserId = async (userId: string): Promise<ApiResponse<TrustedContactResponse[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TRUSTED_CONTACTS}/user/${userId}`, {
      method: 'GET',
      headers: DEFAULT_HEADERS,
    });

    if (response.ok) {
      const data: TrustedContactsListResponse = await response.json();
      return {
        success: true,
        data: data.contacts, // Extract the contacts array from the response
      };
    } else {
      const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
      return {
        success: false,
        error: errorData.message || 'Request failed',
      };
    }
  } catch {
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
};

// Face Recognition API
export const recognizeFace = async (imageFile: File, userId: string): Promise<ApiResponse<{
  message: string;
  matches: TrustedContactResponse[];
  count: number;
  searchCriteria: {
    userId: string;
    threshold: number;
  };
}>> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('userId', userId);

    const response = await fetch(`${API_BASE_URL}/face-recognition`, {
      method: 'POST',
      body: formData, // Don't set Content-Type header for FormData
    });

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
  } catch {
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
};

// Delete Contact
export const deleteContact = async (contactId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CONTACT}/${contactId}`, {
      method: 'DELETE',
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