import React from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Phone, PhoneOff } from 'lucide-react';

const WebRTCVideo = ({ 
  isConnected, 
  isConnecting, 
  error, 
  localVideoRef, 
  remoteVideoRef, 
  connect, 
  disconnect 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Video Call</h3>
        <p className="text-gray-600">Connect with other users for secure payments</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-red-700 text-sm">{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Local Video */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Your Video</h4>
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {!isConnected && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Remote Video */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Remote Video</h4>
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!isConnected && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        {!isConnected ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={connect}
            disabled={isConnecting}
            className="btn-primary py-3 px-6 disabled:opacity-50"
          >
            {isConnecting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Connecting...
              </div>
            ) : (
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Start Call
              </div>
            )}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={disconnect}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <div className="flex items-center">
              <PhoneOff className="w-5 h-5 mr-2" />
              End Call
            </div>
          </motion.button>
        )}
      </div>

      {isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 text-sm font-medium">Connected</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WebRTCVideo;


