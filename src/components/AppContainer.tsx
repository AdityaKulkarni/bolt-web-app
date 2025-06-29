import React from 'react';

interface AppContainerProps {
  children: React.ReactNode;
}

const AppContainer: React.FC<AppContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Container that centers and restricts width on larger screens */}
      <div className="mx-auto w-full lg:max-w-[40%] min-h-screen bg-white shadow-lg">
        {/* App content */}
        {children}
      </div>
    </div>
  );
};

export default AppContainer; 