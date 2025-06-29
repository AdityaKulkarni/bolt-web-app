import { Contact } from '../api/types';

// Storage keys
export const STORAGE_KEYS = {
  USER: 'memwar_user',
  TOKEN: 'memwar_token',
  CONTACTS: 'memwar_contacts',
  RECOGNITION_LOGS: 'recognition_logs',
} as const;

// User data interface (matches UserResponse from API)
export interface StoredUser {
  id: string;
  name: string;
  email: string;
  gender: string;
  dateofbirth: string;
  phone: string;
  createdAt: string;
  avatar?: string; // Optional for UI display
}

// Recognition log type
export interface RecognitionLog {
  contactId: string;
  name: string;
  relationship: string;
  picture?: string;
  phone?: string;
  location?: string;
  timestamp: string;
  image?: string;
}

// Storage utility functions
export const storage = {
  // User operations
  getUser: (): StoredUser | null => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error reading user from storage:', error);
      return null;
    }
  },

  setUser: (user: StoredUser): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error writing user to storage:', error);
    }
  },

  removeUser: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error removing user from storage:', error);
    }
  },

  // Token operations
  getToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error reading token from storage:', error);
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error('Error writing token to storage:', error);
    }
  },

  removeToken: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error removing token from storage:', error);
    }
  },

  // Authentication state
  isAuthenticated: (): boolean => {
    const user = storage.getUser();
    return !!user; // Only check for user existence, token is optional
  },

  // Clear all auth data
  clearAuth: (): void => {
    storage.removeUser();
    storage.removeToken();
  },

  // Contacts operations
  getContacts: (): Contact[] => {
    try {
      const contactsData = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      const contacts = contactsData ? JSON.parse(contactsData) : [];
      // Ensure memoryScore is present
      return contacts.map((c: Contact) => ({ ...c, memoryScore: typeof c.memoryScore === 'number' ? c.memoryScore : 0 }));
    } catch (error) {
      console.error('Error reading contacts from storage:', error);
      return [];
    }
  },

  setContacts: (contacts: Contact[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    } catch (error) {
      console.error('Error writing contacts to storage:', error);
    }
  },

  // Increment memory score for a contact
  incrementMemoryScore: (contactId: string): void => {
    const contacts = storage.getContacts();
    const updated = contacts.map(c => c.id === contactId ? { ...c, memoryScore: (c.memoryScore || 0) + 1 } : c);
    storage.setContacts(updated);
  },

  // Decrement memory score for a contact
  decrementMemoryScore: (contactId: string): void => {
    const contacts = storage.getContacts();
    const updated = contacts.map(c => c.id === contactId ? { ...c, memoryScore: (c.memoryScore || 0) - 1 } : c);
    storage.setContacts(updated);
  },

  // Recognition log operations
  getRecognitionLogs: (): RecognitionLog[] => {
    try {
      const logs = localStorage.getItem(STORAGE_KEYS.RECOGNITION_LOGS);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Error reading recognition logs from storage:', error);
      return [];
    }
  },

  addRecognitionLog: (log: RecognitionLog): void => {
    try {
      const logs = storage.getRecognitionLogs();
      logs.unshift(log);
      localStorage.setItem(STORAGE_KEYS.RECOGNITION_LOGS, JSON.stringify(logs));
    } catch (error) {
      console.error('Error writing recognition log to storage:', error);
    }
  },

  clearRecognitionLogs: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.RECOGNITION_LOGS);
    } catch (error) {
      console.error('Error clearing recognition logs from storage:', error);
    }
  },

  // Clear all data
  clearAll: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
}; 