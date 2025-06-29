import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart3, Bell, BookOpen, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Bell, label: 'Updates', path: '/dashboard' },
    { icon: BookOpen, label: 'Contacts', path: '/contacts' },
    { icon: BarChart3, label: 'Insights', path: '/insights' },
    { icon: User, label: 'My Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white border-t border-gray-200 px-6 py-4 w-full lg:w-[40%]">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;