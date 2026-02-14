import React from 'react';
import Loader from '../Loader/Loader.jsx';

const AvailabilityToggle = ({
  isAvailable,
  onToggle,
  disabled = false,
  loading = false,
  socialLinks = {
    linkedin: '',
    github: '',
    leetcode: ''
  }
}) => {
  const handleToggle = () => {
    if (!disabled && !loading) {
      onToggle(!isAvailable);
    }
  };

  const socialButtons = [
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      url: socialLinks.linkedin,
      hoverColor: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    {
      name: 'GitHub',
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ),
      url: socialLinks.github,
      hoverColor: 'hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700'
    },
    {
      name: 'LeetCode',
      icon: (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
        </svg>
      ),
      url: socialLinks.leetcode,
      hoverColor: 'hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
    }
  ];

  const hasAnySocialLink = socialButtons.some(social => social.url);

  return (
    <div className="space-y-4">
      {/* Toggle Section */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
            {isAvailable ? 'Available' : 'Unavailable'}
          </p>
          <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">
            {isAvailable ? 'Open for work' : 'Not accepting offers'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled || loading}
          className={`
            relative inline-flex flex-shrink-0 cursor-pointer rounded-full
            transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-2
            w-11 h-6 shadow-sm
            ${isAvailable
              ? 'bg-gradient-to-r from-emerald-400 to-green-500 focus:ring-green-400'
              : 'bg-gray-300 dark:bg-gray-600 focus:ring-gray-400'
            }
            ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
          `}
          role="switch"
          aria-checked={isAvailable}
          aria-label="Toggle availability status"
        >
          <span className="sr-only">
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>

          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader size="xs" inline />
            </div>
          ) : (
            <span
              className={`
                pointer-events-none inline-block rounded-full bg-white shadow-lg
                transform transition-all duration-300 ease-in-out
                w-5 h-5
                ${isAvailable ? 'translate-x-5' : 'translate-x-0.5'}
              `}
            />
          )}
        </button>
      </div>

      {/* Social Media Links Section - Always Visible */}
      <div className="border-t border-gray-200/50 dark:border-white/5" />
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Connect with me
        </p>
        <div className="flex gap-1.5">
          {socialButtons.map((social) => (
            social.url ? (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center justify-center p-2 rounded-lg
                  transition-all duration-200
                  bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm
                  border border-gray-200/50 dark:border-white/10
                  text-gray-600 dark:text-gray-400
                  ${social.hoverColor}
                  hover:scale-110 hover:shadow-md active:scale-95
                  flex-1
                `}
                title={social.name}
                aria-label={`Visit ${social.name} profile`}
              >
                {social.icon}
              </a>
            ) : (
              <button
                key={social.name}
                disabled
                className={`
                  flex items-center justify-center p-2 rounded-lg
                  transition-all duration-200
                  bg-gray-100/50 dark:bg-slate-900/50 backdrop-blur-sm
                  border border-gray-200/30 dark:border-white/5
                  text-gray-400 dark:text-gray-600
                  cursor-not-allowed opacity-50
                  flex-1
                `}
                title={`${social.name} - Not connected`}
                aria-label={`${social.name} profile not connected`}
              >
                {social.icon}
              </button>
            )
          ))}
        </div>
        {!hasAnySocialLink && (
          <p className="text-[9px] text-gray-400 dark:text-gray-500 italic text-center mt-1">
            Add your social links in profile settings
          </p>
        )}
      </div>
    </div>
  );
};

export default AvailabilityToggle;
