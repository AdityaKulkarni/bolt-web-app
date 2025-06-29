import React, { useState, useRef } from 'react';
import { ArrowLeft, Edit3, Camera, X, Image, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContacts } from '../contexts/ContactContext';
import BottomNavigation from './BottomNavigation';

interface PhotoItem {
  id: string;
  url: string;
  title: string;
  updatedAt: string;
}

const EditContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { contacts, updateContact, deleteContact } = useContacts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const contact = contacts.find(c => c.id === id);
  
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    relationship: contact?.relationship || '',
    locationMet: contact?.location || '',
    contact: contact?.contact || '',
    note: contact?.notes || ''
  });
  
  const [photos, setPhotos] = useState<PhotoItem[]>([
    {
      id: '1',
      url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
      title: 'Title',
      updatedAt: 'Updated today'
    },
    {
      id: '2',
      url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
      title: 'Title',
      updatedAt: 'Updated yesterday'
    },
    {
      id: '3',
      url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
      title: 'Title',
      updatedAt: 'Updated 2 days ago'
    }
  ]);
  
  const [profilePhoto, setProfilePhoto] = useState<string>(contact?.avatar || '');
  const [showSavedState, setShowSavedState] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  if (!contact) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Contact not found</p>
          <button
            onClick={() => navigate('/contacts')}
            className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
          >
            Back to Contacts
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos: PhotoItem[] = [];
      
      for (let i = 0; i < Math.min(files.length, 10 - photos.length); i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const newPhoto: PhotoItem = {
            id: Date.now().toString() + i,
            url: event.target?.result as string,
            title: 'Title',
            updatedAt: 'Updated today'
          };
          
          setPhotos(prev => [...prev, newPhoto]);
        };
        
        reader.readAsDataURL(file);
      }
    }
  };

  const handleProfilePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePhoto(event.target?.result as string);
        setShowPhotoOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
      setShowPhotoOptions(false);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please try selecting from gallery instead.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setProfilePhoto(imageData);
        closeCamera();
      }
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const handleSave = () => {
    if (!formData.name || !formData.relationship) {
      alert('Please fill in required fields');
      return;
    }

    // Show saved state first
    setShowSavedState(true);
    
    // After showing saved state, update contact and navigate
    setTimeout(() => {
      updateContact(contact.id, {
        name: formData.name,
        relationship: formData.relationship,
        avatar: profilePhoto,
        notes: formData.note,
        location: formData.locationMet,
        contact: formData.contact
      });
      
      navigate('/contacts');
    }, 2000);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this contact?')) {
      deleteContact(contact.id);
      navigate('/contacts');
    }
  };

  const handleCancel = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    navigate('/contacts');
  };

  if (showSavedState) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Updated!</h2>
          <p className="text-gray-600">Your contact has been successfully updated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pb-24 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/contacts')}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Details</h1>
          </div>
          <button
            onClick={handleDelete}
            className="p-2 rounded-full hover:bg-red-50 transition-colors"
          >
            <Trash2 size={20} className="text-red-500" />
          </button>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Contact"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 text-purple-400">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowPhotoOptions(true)}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Edit3 size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Photo Options Modal */}
        {showPhotoOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white rounded-t-3xl w-full p-6">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Update Profile Photo</h3>
              
              <div className="space-y-4">
                <button
                  onClick={startCamera}
                  className="w-full flex items-center justify-center py-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                >
                  <Camera size={20} className="mr-3" />
                  Take Photo
                </button>
                
                <button
                  onClick={() => profilePhotoInputRef.current?.click()}
                  className="w-full flex items-center justify-center py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <Image size={20} className="mr-3" />
                  Choose from Gallery
                </button>
                
                <button
                  onClick={() => setShowPhotoOptions(false)}
                  className="w-full py-4 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <div className="flex-1 relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Camera Controls */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center px-8">
                <button
                  onClick={closeCamera}
                  className="absolute left-8 bg-gray-800 bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-colors"
                >
                  <X size={24} />
                </button>
                
                <button
                  onClick={capturePhoto}
                  className="bg-white rounded-full p-4 shadow-lg hover:bg-gray-50 transition-colors"
                >
                  <Camera size={32} className="text-gray-800" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship
            </label>
            <select
              value={formData.relationship}
              onChange={(e) => handleInputChange('relationship', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">Select</option>
              <option value="Spouse">Spouse</option>
              <option value="Partner">Partner</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Grandson">Grandson</option>
              <option value="Granddaughter">Granddaughter</option>
              <option value="Friend">Friend</option>
              <option value="Neighbor">Neighbor</option>
              <option value="Caregiver">Caregiver</option>
              <option value="Doctor">Doctor</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact
            </label>
            <input
              type="tel"
              placeholder="(000) 000 0000"
              value={formData.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Met
            </label>
            <input
              type="text"
              placeholder="Add a location"
              value={formData.locationMet}
              onChange={(e) => handleInputChange('locationMet', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note
            </label>
            <textarea
              placeholder="Add a note to remember"
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              rows={3}
              maxLength={300}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">300 characters limit</p>
          </div>

          {/* Meeting Logs Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Camera size={20} className="mr-2 text-gray-600" />
                <span className="font-medium text-gray-900">Meeting Logs</span>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Add Photos
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative">
                  <div className="bg-purple-100 rounded-lg p-4 aspect-square flex items-center justify-center relative">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900">{photo.title}</p>
                    <p className="text-xs text-gray-500">{photo.updatedAt}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />

            <input
              ref={profilePhotoInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePhotoSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-8">
          <button
            onClick={handleCancel}
            className="flex-1 bg-purple-100 text-purple-600 py-3 rounded-full font-semibold hover:bg-purple-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-purple-600 text-white py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      <BottomNavigation />
    </div>
  );
};

export default EditContactPage;