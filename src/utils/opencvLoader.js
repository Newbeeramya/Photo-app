// OpenCV.js loader utility
let isOpenCVLoaded = false;
let loadingPromise = null;

export const loadOpenCV = () => {
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

    // Create script element to load OpenCV.js
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.8.0/opencv.js';
    script.async = true;

    script.onload = () => {
      // OpenCV.js loads asynchronously, need to wait for it to be ready
      const checkOpenCV = () => {
        if (window.cv && window.cv.Mat) {
          isOpenCVLoaded = true;
          console.log('OpenCV.js loaded successfully');
          resolve();
        } else {
          setTimeout(checkOpenCV, 100);
        }
      };
      checkOpenCV();
    };

    script.onerror = () => {
      console.error('Failed to load OpenCV.js');
      reject(new Error('Failed to load OpenCV.js'));
    };

    document.head.appendChild(script);

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!isOpenCVLoaded) {
        reject(new Error('OpenCV.js loading timeout'));
      }
    }, 30000);
  });

  return loadingPromise;
};

export const isOpenCVReady = () => isOpenCVLoaded;
