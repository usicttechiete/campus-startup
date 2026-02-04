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
        className={`
          absolute inset-0 rounded-full border-2 border-white shadow-md
          transition-all duration-300 ease-in-out
          ${isOnline 
            ? 'bg-green-500' 
            : 'bg-gray-400'
          }
        `}
        style={{
          animation: isOnline ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
        }}
      />
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default OnlineStatusDot;
