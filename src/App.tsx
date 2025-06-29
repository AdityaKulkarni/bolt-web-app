import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ContactProvider } from './contexts/ContactContext';
import { AuthProvider } from './contexts/AuthContext';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import Dashboard from './components/Dashboard';
import ContactsPage from './components/ContactsPage';
import AddContactPage from './components/AddContactPage';
import ProfilePage from './components/ProfilePage';
import EditProfilePage from './components/EditProfilePage';
import SettingsPage from './components/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import AppRouter from './components/AppRouter';
import AppContainer from './components/AppContainer';
import InsightsPage from './components/InsightsPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ContactProvider>
        <Router>
          <AppContainer>
            <div className="App">
              <Routes>
                {/* Public Routes - Wrapped with AppRouter for auth check */}
                <Route path="/" element={
                  <AppRouter>
                    <WelcomeScreen />
                  </AppRouter>
                } />
                <Route path="/login" element={
                  <AppRouter>
                    <LoginScreen />
                  </AppRouter>
                } />
                <Route path="/signup" element={
                  <AppRouter>
                    <SignUpScreen />
                  </AppRouter>
                } />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/contacts" element={
                  <ProtectedRoute>
                    <ContactsPage />
                  </ProtectedRoute>
                } />
                <Route path="/add-contact" element={
                  <ProtectedRoute>
                    <AddContactPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/edit-profile" element={
                  <ProtectedRoute>
                    <EditProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/insights" element={
                  <ProtectedRoute>
                    <InsightsPage />
                  </ProtectedRoute>
                } />
                
                {/* Default redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </AppContainer>
        </Router>
      </ContactProvider>
    </AuthProvider>
  );
};

export default App;