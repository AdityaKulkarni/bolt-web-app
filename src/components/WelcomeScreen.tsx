import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const floatingFaces = [
    { src: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', delay: '0s', position: 'top-32 right-16' },
    { src: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', delay: '0.5s', position: 'top-48 right-4' },
    { src: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', delay: '1s', position: 'top-96 left-8' },
    { src: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', delay: '1.5s', position: 'bottom-80 right-8' },
    { src: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', delay: '2s', position: 'bottom-96 left-16' },
    { src: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', delay: '2.5s', position: 'bottom-64 right-20' },
    { src: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', delay: '3s', position: 'top-64 left-4' },
    { src: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', delay: '3.5s', position: 'bottom-48 left-4' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Status Bar */}

      {/* Floating Face Photos */}
      {floatingFaces.map((face, index) => (
        <div
          key={index}
          className={`absolute ${face.position} animate-bounce`}
          style={{
            animationDelay: face.delay,
            animationDuration: '3s',
            animationIterationCount: 'infinite'
          }}
        >
          <img
            src={face.src}
            alt="Face"
            className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-white"
          />
        </div>
      ))}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-8 relative z-10">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
            <img
              src="/app_logo.png"
              alt="MEMORIE Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-wide">
          MEMORIE
        </h1>

        {/* Tagline */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16 leading-tight max-w-sm">
          Remember the faces that matter.
        </h2>

        {/* Company Badge */}
        <a 
          href="https://www.bolt.new" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:opacity-80 transition-opacity"
        >
          <img
            src="/white_circle_360x360 2.png"
            alt="Company Logo"
            className="w-12 h-12 object-contain"
          />
        </a>

        {/* Get Started Button */}
        <button
          onClick={() => navigate('/login')}
          className="w-full max-w-sm bg-purple-600 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-purple-700 transition-colors duration-200 active:scale-95 transform"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
