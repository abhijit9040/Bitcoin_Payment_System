import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
      className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    />
  );
};

export const LoadingButton = ({ loading, children, ...props }) => (
  <button
    disabled={loading}
    className={`btn-primary disabled:opacity-50 ${props.className || ''}`}
    {...props}
  >
    {loading ? (
      <div className="flex items-center justify-center">
        <LoadingSpinner size="sm" color="white" className="mr-2" />
        Loading...
      </div>
    ) : (
      children
    )}
  </button>
);

export const LoadingOverlay = ({ loading, children }) => (
  <div className="relative">
    {children}
    {loading && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10"
      >
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </motion.div>
    )}
  </div>
);

export const LoadingPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-gray-600">Loading your wallet...</p>
    </motion.div>
  </div>
);

export default LoadingSpinner;


