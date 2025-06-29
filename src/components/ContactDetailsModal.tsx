import React from 'react';
import { X, Phone, MapPin, Calendar } from 'lucide-react';
import { Contact } from '../api/types';

interface ContactDetailsModalProps {
  contact: Contact | null;
  onClose: () => void;
}

const ContactDetailsModal: React.FC<ContactDetailsModalProps> = ({ contact, onClose }) => {
  if (!contact) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Contact Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Contact Avatar and Basic Info */}
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
              {contact.avatar ? (
                <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-16 h-16 text-gray-400">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{contact.name}</h3>
            <p className="text-purple-600 font-medium">{contact.relationship}</p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            {/* Phone Number */}
            {contact.contact && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Phone size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{contact.contact}</p>
                </div>
              </div>
            )}

            {/* Location */}
            {contact.location && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{contact.location}</p>
                </div>
              </div>
            )}

            {/* Last Seen */}
            {contact.lastSeen && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Last Seen</p>
                  <p className="font-medium text-gray-900">{contact.lastSeen}</p>
                </div>
              </div>
            )}

            {/* Notes */}
            {contact.notes && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Notes</p>
                <p className="text-gray-900">{contact.notes}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4">
            {contact.contact && (
              <button
                onClick={() => window.open(`tel:${contact.contact}`, '_self')}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <Phone size={16} />
                <span>Call</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsModal;