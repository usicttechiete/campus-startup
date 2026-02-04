import React, { useState } from 'react';
import Loader from '../Loader/Loader.jsx';

const AvailabilityToggle = ({ 
  isAvailable, 
  onToggle, 
  disabled = false, 
  loading = false,
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-8 h-5',
    medium: 'w-11 h-6',
    large: 'w-14 h-8',
  };

  const dotSizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  const toggleSize = sizeClasses[size] || sizeClasses.medium;
  const dotSize = dotSizeClasses[size] || dotSizeClasses.medium;

  const handleToggle = () => {
    if (!disabled && !loading) {
      onToggle(!isAvailable);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled || loading}
          className={`
            relative inline-flex flex-shrink-0 cursor-pointer rounded-full
            border-2 border-transparent transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            ${toggleSize}
            ${isAvailable 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-300 hover:bg-gray-400'
            }
            ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          role="switch"
          aria-checked={isAvailable}
          aria-label="Available to work"
        >
          <span className="sr-only">
            {isAvailable ? 'Available to work' : 'Not available to work'}
          </span>
          
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader size="xs" inline />
            </div>
          ) : (
            <span
              className={`
                pointer-events-none inline-block rounded-full bg-white shadow-lg
                transform transition-transform duration-200 ease-in-out
                ${dotSize}
                ${isAvailable ? 'translate-x-5' : 'translate-x-0'}
              `}
              style={{
                transform: isAvailable 
                  ? size === 'small' ? 'translateX(12px)' 
                  : size === 'large' ? 'translateX(24px)' 
                  : 'translateX(20px)'
                  : 'translateX(0)',
              }}
            />
          )}
        </button>

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            Available to Work
          </p>
          <p className="text-xs text-gray-500">
            {isAvailable 
              ? 'Open for internships / projects' 
              : 'Currently unavailable'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityToggle;
