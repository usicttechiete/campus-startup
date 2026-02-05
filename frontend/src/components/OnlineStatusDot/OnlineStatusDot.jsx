import React from 'react';

const OnlineStatusDot = ({ isOnline, size = 'small' }) => {
  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5',
  };

  const dotSize = sizeClasses[size] || sizeClasses.small;

  return (
    <div className={`${dotSize} relative`}>
      <div
        className={`absolute inset-0 rounded-full border-2 border-white shadow-md transition-all duration-300 ease-in-out ${
          isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        }`}
      />
    </div>
  );
};

export default OnlineStatusDot;
