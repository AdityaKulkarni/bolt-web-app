// User Registration Request
export interface UserRegistrationRequest {
  name: string;
  email: string;
  password: string;
  gender: 'male' | 'female';
  dateofbirth: string;
  phone: string;
}

// User Login Request
export interface UserLoginRequest {
  email: string;
  password: string;
}

// User Response from API
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  gender: string;
  dateofbirth: string;
  phone: string;
  createdAt: string;
}

// Login Response from API
export interface LoginResponse {
  success: boolean;
  user?: UserResponse;
  message: string;
}

// User Profile Response (for backward compatibility)
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  gender: 'male' | 'female';
  dateofbirth: string;
  phone: string;
  avatar?: string;
  token?: string;
}

// Relationship type for trusted contacts
export type Relationship = "Mother" | "Father" | "Brother" | "Sister" | "Wife" | "Husband" | "Son" | "Daughter" | "Girlfriend" | "Boyfriend" | "Friend";

// Trusted Contact Request
export interface TrustedContactRequest {
  name: string;
  relationship: Relationship;
  location: string;
  phone: string;
  email?: string; // Optional field
  note?: string;
  picture?: string;
  user: string; // User ID reference
}

// Trusted Contact Response
export interface TrustedContactResponse {
  id: string;
  faceId: string;
  name: string;
  relationship: Relationship;
  location: string;
  phone: string;
  email?: string;
  note?: string;
  picture?: string;
  user: string;
  faceConfidence: number;
  faceIndexed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Trusted Contacts List Response
export interface TrustedContactsListResponse {
  message: string;
  contacts: TrustedContactResponse[];
  count: number;
}

// Contact Request/Response
export interface Contact {
  id: string;
  name: string;
  relationship: string;
  avatar: string;
  lastSeen?: string;
  location?: string;
  notes?: string;
  contact?: string;
  memoryScore?: number; // Memory score for this contact
}

export interface CreateContactRequest {
  name: string;
  relationship: string;
  avatar: string;
  notes?: string;
  location?: string;
  contact?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
} 