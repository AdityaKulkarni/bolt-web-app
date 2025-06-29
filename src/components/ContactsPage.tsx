import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, RefreshCw } from 'lucide-react';
import { useContacts } from '../contexts/ContactContext';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import ContactDetailsModal from './ContactDetailsModal';
import { Contact } from '../api/types';
import { storage } from '../utils/storage';

const ContactsPage: React.FC = () => {
  const { contacts, deleteContact, loading, error, refreshContacts } = useContacts();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Check if we need to fetch contacts on first visit
  useEffect(() => {
    const storedContacts = localStorage.getItem('memwar_contacts');
    const isAuthenticated = storage.isAuthenticated();
    
    // If user is authenticated but no contacts are stored, fetch them
    if (isAuthenticated && !storedContacts && contacts.length === 0 && !loading) {
      console.log('First visit to contacts page, fetching contacts...');
      refreshContacts();
    }
  }, [contacts.length, loading, refreshContacts]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.relationship.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleCloseModal = () => {
    setSelectedContact(null);
  };

  const handleRefresh = async () => {
    await refreshContacts();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6">
      <div className="px-6 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gray-100 text-gray-600 p-3 rounded-full shadow-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => navigate('/add-contact')}
            className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} />
          </button>
          </div>
        </div>
      </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <RefreshCw size={32} className="animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading contacts...</p>
          </div>
        )}

        {/* Contacts List */}
        {!loading && (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div 
                key={contact.id} 
                className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleContactClick(contact)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-500">{contact.relationship}</p>
                      {contact.lastSeen && (
                        <p className="text-xs text-gray-400">{contact.lastSeen}</p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteContact(contact.id);
                    }}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No contacts found' : 'No contacts yet'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/add-contact')}
                className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
              >
                Add Your First Contact
              </button>
            )}
          </div>
        )}
        {/* Contact Details Modal */}
        <ContactDetailsModal
          contact={selectedContact}
          onClose={handleCloseModal}
        />

        <BottomNavigation />
    </div>
  );
};

export default ContactsPage;