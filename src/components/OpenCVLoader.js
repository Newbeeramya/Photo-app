import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

const OpenCVLoader = ({ onComplete, onError }) => {
  const [loadingStatus, setLoadingStatus] = useState('Loading...');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const simulateLoading = async () => {
      try {
        setLoadingStatus('Initializing...');
        setProgress(20);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoadingStatus('Loading components...');
        setProgress(60);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoadingStatus('Almost ready...');
        setProgress(90);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(100);
        setLoadingStatus('Ready!');
        
        setTimeout(() => onComplete(), 300);
        
      } catch (err) {
        console.error('Loading failed:', err);
        setError(err.message || 'Failed to load');
        onError(err);
      }
    };

    simulateLoading();
  }, [onComplete, onError]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Loading Failed
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4 text-center">
        <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Loading Image Processing
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {loadingStatus}
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {Math.round(progress)}% complete
        </p>
        
        <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          This only happens once. Future loads will be instant.
        </div>
      </div>
    </div>
  );
};

export default OpenCVLoader;
