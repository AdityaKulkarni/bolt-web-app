import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTrustedContactsByUserId } from '../api/contacts';
import { TrustedContactResponse } from '../api/types';
import { storage } from '../utils/storage';

export interface Contact {
  id: string;
  name: string;
  relationship: string;
  avatar: string;
  lastSeen?: string;
  location?: string;
  notes?: string;
  contact?: string;
}

interface ContactContextType {
  contacts: Contact[];
  recentContacts: Contact[];
  loading: boolean;
  error: string | null;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  recordSighting: (contactId: string, location?: string) => void;
  refreshContacts: () => Promise<void>;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
};

// Helper function to convert TrustedContactResponse to Contact
const convertTrustedContactToContact = (trustedContact: TrustedContactResponse): Contact => {
  return {
    id: trustedContact.id,
    name: trustedContact.name,
    relationship: trustedContact.relationship,
    avatar: `https://boltsample.s3.us-west-1.amazonaws.com/${trustedContact.picture}`,
    location: trustedContact.location,
    notes: trustedContact.note,
    contact: trustedContact.phone,
  };
};

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContactsFromAPI = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if user is authenticated first
      if (!storage.isAuthenticated()) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const user = storage.getUser();
      
      if (!user?.id) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const response = await getTrustedContactsByUserId(user.id);
      
      if (response.success && response.data) {
        const convertedContacts = response.data.map(convertTrustedContactToContact);
        setContacts(convertedContacts);
        setRecentContacts(convertedContacts.slice(0, 4));
        localStorage.setItem('memwar_contacts', JSON.stringify(convertedContacts));
      } else {
        setError(response.error || 'Failed to fetch contacts');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshContacts = async (): Promise<void> => {
    await fetchContactsFromAPI();
  };

  useEffect(() => {
    // Load contacts from localStorage first
    const storedContacts = localStorage.getItem('memwar_contacts');
    
    if (storedContacts) {
      const parsed = JSON.parse(storedContacts);
      setContacts(parsed);
      setRecentContacts(parsed.slice(0, 4));
    }
    // Removed the automatic API fetch on mount - now handled by ContactsPage
  }, []);

  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString()
    };
    
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    localStorage.setItem('memwar_contacts', JSON.stringify(updatedContacts));
  };

  const updateContact = (id: string, contactUpdate: Partial<Contact>) => {
    const updatedContacts = contacts.map(contact =>
      contact.id === id ? { ...contact, ...contactUpdate } : contact
    );
    setContacts(updatedContacts);
    localStorage.setItem('memwar_contacts', JSON.stringify(updatedContacts));
  };

  const deleteContact = (id: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);
    setRecentContacts(updatedContacts.slice(0, 4));
    localStorage.setItem('memwar_contacts', JSON.stringify(updatedContacts));
  };

  const recordSighting = (contactId: string, location?: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const lastSeen = location ? `${timeString} • ${location}` : timeString;
    
    updateContact(contactId, { lastSeen, location });
    
    // Move to recent contacts
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      const updatedRecent = [contact, ...recentContacts.filter(c => c.id !== contactId)].slice(0, 4);
      setRecentContacts(updatedRecent);
    }
  };

  return (
    <ContactContext.Provider value={{
      contacts,
      recentContacts,
      loading,
      error,
      addContact,
      updateContact,
      deleteContact,
      recordSighting,
      refreshContacts
    }}>
      {children}
    </ContactContext.Provider>
  );
};