// Simplified OpenCV.js loader utility
let isOpenCVLoaded = false;
let loadingPromise = null;

// Simple preload function
export const preloadOpenCV = () => {
  if (isOpenCVLoaded || loadingPromise) {
    return;
  }
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = 'https://docs.opencv.org/4.8.0/opencv.js';
  link.as = 'script';
  document.head.appendChild(link);
};

export const loadOpenCV = (onProgress) => {
  if (isOpenCVLoaded) {
    return Promise.resolve();
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = new Promise((resolve, reject) => {
    // Check if OpenCV is already available
    if (window.cv && window.cv.Mat) {
      isOpenCVLoaded = true;
      resolve();
      return;
    }

    if (onProgress) {
      onProgress('Downloading OpenCV.js library...');
    }

    // Create script element to load OpenCV.js
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.8.0/opencv.js';
    script.async = true;

    script.onload = () => {
      if (onProgress) onProgress('Initializing OpenCV...');
      
      // OpenCV.js loads asynchronously, need to wait for it to be ready
      const checkOpenCV = () => {
        if (window.cv && window.cv.Mat) {
          isOpenCVLoaded = true;
          if (onProgress) onProgress('OpenCV ready!');
          console.log('OpenCV.js loaded successfully');
          resolve();
        } else {
          setTimeout(checkOpenCV, 100);
        }
      };
      checkOpenCV();
    };

    script.onerror = () => {
      const error = new Error('Failed to load OpenCV.js');
      console.error('Failed to load OpenCV.js');
      reject(error);
    };

    document.head.appendChild(script);

    // Timeout after 15 seconds
    setTimeout(() => {
      if (!isOpenCVLoaded) {
        reject(new Error('OpenCV.js loading timeout'));
      }
    }, 15000);
  });

  return loadingPromise;
};

export const isOpenCVReady = () => isOpenCVLoaded;
