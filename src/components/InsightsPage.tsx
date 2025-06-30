import React from 'react';
import BottomNavigation from './BottomNavigation';
import { storage } from '../utils/storage';

const InsightsPage: React.FC = () => {
  // Get all contacts and recognition logs
  const contacts = storage.getContacts();
  const recognitionLogs = storage.getRecognitionLogs();

  // Filter contacts to only those with at least one recognition log and memoryScore > 0
  const contactsWithLogs = contacts.filter(contact => {
    const logs = recognitionLogs.filter(log => log.contactId === contact.id);
    return logs.length > 0 && (contact.memoryScore || 0) > 0;
  });

  // Calculate accumulative memory score
  const totalScore = contactsWithLogs.reduce((sum, c) => sum + (c.memoryScore || 0), 0);
  const totalSeen = contactsWithLogs.reduce((sum, c) => {
    const logs = recognitionLogs.filter(log => log.contactId === c.id);
    return sum + logs.length;
  }, 0);
  const percent = totalSeen > 0 ? Math.round((totalScore / totalSeen) * 100) : 0;

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4 text-sm font-medium bg-gray-50">
        <span>9:30</span>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-black rounded-sm"></div>
          <div className="w-6 h-3 border border-black rounded-sm">
            <div className="w-4 h-1 bg-black rounded-sm m-0.5"></div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pb-24">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
              <p className="text-gray-500">Track your memory performance</p>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <a href="https://bolt.new" target="_blank" rel="noopener noreferrer">
                <img
                  src="/bolt_logo.png"
                  alt="Company Logo"
                  className="w-12 h-12 object-contain"
                />
              </a>
            </div>
          </div>

          {/* Memory Score Card */}
          <div className="bg-purple-50 border border-purple-400 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between mb-8" style={{ borderWidth: 1 }}>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900">My Memory Score</h2>
              </div>
              <div className="flex items-end space-x-4 mb-2">
                <span className="text-6xl font-extrabold text-gray-900">{percent}%</span>
              </div>
              <div className="text-lg font-medium text-gray-800 mt-2">Average Recognition Rate</div>
            </div>
          </div>

          {/* Per-Contact Memory Score List */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Per-Contact Memory Score</h3>
            <ul className="divide-y divide-gray-100">
              {contacts.map(contact => {
                const logs = recognitionLogs.filter(log => log.contactId === contact.id);
                const seenCount = logs.length;
                if (seenCount === 0) return null;
                return (
                  <li key={contact.id} className="flex items-center py-3">
                    <img
                      src={contact.avatar || '/default-avatar.png'}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full object-cover mr-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-500">{contact.relationship}</div>
                    </div>
                    <div className="text-base font-semibold text-purple-700">
                      {contact.memoryScore || 0}/{seenCount}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default InsightsPage; 