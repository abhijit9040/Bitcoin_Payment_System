import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Send, 
  QrCode, 
  Download, 
  LogOut, 
  User,
  Wallet,
  Video,
  Shield
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/send', icon: Send, label: 'Send Money' },
    { path: '/receive', icon: Download, label: 'Receive Money' },
    { path: '/scan', icon: QrCode, label: 'Scan & Pay' },
    { path: '/webrtc', icon: Video, label: 'WebRTC' },
    { path: '/security', icon: Shield, label: 'Security' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center"
              >
                <Wallet className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WebRTC Wallet</h1>
                <p className="text-sm text-gray-500">@{user?.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Balance</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${user?.balance?.toFixed(2) || '0.00'}
                </p>
              </div>
              <NotificationCenter />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.nav
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-64"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <motion.div
                      key={item.path}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.nav>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
