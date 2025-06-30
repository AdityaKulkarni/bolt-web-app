import React from 'react';
import { Settings, HelpCircle, Shield, LogOut, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import { storage } from '../utils/storage';

const ProfilePage: React.FC = () => {
  const user = storage.getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    storage.removeUser();
    storage.clearAll();
    navigate('/');
  };

  const menuItems = [
    { icon: Edit3, label: 'Edit Profile', action: () => navigate('/edit-profile') },
    // { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
    { icon: Shield, label: 'Privacy & Security', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
    { icon: LogOut, label: 'Log Out', action: handleLogout, danger: true }
  ];

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
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

        {/* Profile Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center">
          <div className="w-16 h-16 text-purple-400">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <button 
              onClick={() => navigate('/edit-profile')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit3 size={20} />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className={`w-full bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${
                  item.danger ? 'text-red-600' : 'text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <Icon size={20} className="mr-4" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {!item.danger && (
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
            <a href="https://bolt.new" target="_blank" rel="noopener noreferrer">
              <img
                src="/bolt_logo.png"
                alt="Company Logo"
                className="w-12 h-12 object-contain"
              />
            </a>
          </div>
          <p className="text-xs text-gray-500">memorie.io v1.0.0</p>
          <p className="text-xs text-gray-500">Made with ❤️ by Bolt.AI</p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;