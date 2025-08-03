import React from 'react';
import { Loader2, Zap } from 'lucide-react';

function LoadingSpinner({ message = 'Processing...', showProgress = false, progress = 0 }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="loading-title">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-sm mx-4 text-center shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <Loader2 className="absolute inset-0 w-16 h-16 text-primary-600 dark:text-primary-400 animate-spin" />
          </div>
        </div>
        
        <h2 id="loading-title" className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          AI Enhancement in Progress
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {message}
        </p>
        
        {showProgress && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label={`Progress: ${progress}%`}
            ></div>
          </div>
        )}
        
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
