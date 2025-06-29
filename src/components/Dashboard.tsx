import React, { useEffect, useState } from 'react';
import { Camera, ChevronRight } from 'lucide-react';
import BottomNavigation from './BottomNavigation';
import CameraModal from './CameraModal';
import { RecognitionLog, storage } from '../utils/storage';

function getTodaysRecognitionLogs(): RecognitionLog[] {
  const logs: RecognitionLog[] = storage.getRecognitionLogs();
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  return logs.filter((log) => log.timestamp && log.timestamp.startsWith(today));
}

const Dashboard: React.FC = () => {
  const [showCamera, setShowCamera] = useState(false);
  const user = storage.getUser();
  const [todaysLogs, setTodaysLogs] = useState<RecognitionLog[]>([]);

  useEffect(() => {
    setTodaysLogs(getTodaysRecognitionLogs());
  }, [showCamera]);

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
            <div className="flex items-center">
              <div>
                <p className="text-sm text-gray-600">Hello, {user?.name}</p>
                <h1 className="text-lg font-semibold text-gray-900">Welcome back!</h1>
              </div>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <img
                src="/bolt_logo.png"
                alt="Company Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>

          {/* Main Feature */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Who's That Face?</h2>
            
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Who's around you? Let's find out.
              </h3>
              <p className="text-gray-600 mb-6">
                Take a quick snap to find out if you've seen someone familiar.
              </p>
              
              <button
                onClick={() => setShowCamera(true)}
                className="w-full bg-purple-600 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-purple-700 transition-colors duration-200 active:scale-95 transform flex items-center justify-center"
              >
                <Camera className="mr-2" size={20} />
                Take a Snap
              </button>
            </div>
          </div>

          {/* Recent Contacts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                People you saw today ({todaysLogs.length})
              </h3>
              <ChevronRight size={20} className="text-gray-400" />
            </div>

            {todaysLogs.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No people recognized today.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {todaysLogs.map((log) => (
                  <div key={log.timestamp + log.contactId} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={log.picture ? `https://boltsample.s3.us-west-1.amazonaws.com/${log.picture}` : '/default-avatar.png'}
                        alt={log.name}
                        className="w-16 h-16 rounded-full object-cover mb-3"
                      />
                      <p className="text-xs text-gray-500 mb-1">{log.relationship}</p>
                      <h4 className="font-semibold text-gray-900 mb-1">{log.name}</h4>
                      <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraModal onClose={() => setShowCamera(false)} />
      )}

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;