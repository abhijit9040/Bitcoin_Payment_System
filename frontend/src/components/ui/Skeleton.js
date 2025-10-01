import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    {...props}
  />
);

export const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="card"
  >
    <div className="flex items-center space-x-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  </motion.div>
);

export const SkeletonTransaction = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
  >
    <div className="flex items-center space-x-4">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <div className="text-right">
      <Skeleton className="h-4 w-16 mb-1" />
      <Skeleton className="h-3 w-12" />
    </div>
  </motion.div>
);

export const SkeletonBalance = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white"
  >
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-48 mb-2 bg-primary-500" />
        <Skeleton className="h-4 w-32 bg-primary-500" />
      </div>
      <div className="text-right">
        <Skeleton className="h-4 w-20 mb-2 bg-primary-500" />
        <Skeleton className="h-10 w-32 bg-primary-500" />
      </div>
    </div>
  </motion.div>
);

export const SkeletonForm = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="card space-y-6"
  >
    <div className="text-center">
      <Skeleton className="h-8 w-48 mx-auto mb-2" />
      <Skeleton className="h-4 w-64 mx-auto" />
    </div>
    
    <div className="space-y-4">
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-12 w-full" />
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  </motion.div>
);

export default Skeleton;

