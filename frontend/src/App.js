import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import SendMoney from './components/SendMoney';
import ReceiveMoney from './components/ReceiveMoney';
import ScanPay from './components/ScanPay';
import WebRTC from './components/WebRTC';
import SecuritySettings from './components/SecuritySettings';
import Layout from './components/Layout';
import PWAInstallPrompt from './components/PWAInstallPrompt';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js', {
          scope: '/'
        })
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.error('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/send" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <SendMoney />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/receive" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ReceiveMoney />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/scan" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ScanPay />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/webrtc" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <WebRTC />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/security" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <SecuritySettings />
                  </Layout>
                </ProtectedRoute>
              } 
            />
          </Routes>
          <PWAInstallPrompt />
        </div>
      </Router>
    </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
