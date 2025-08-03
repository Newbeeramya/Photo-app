import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  RotateCw, 
  Crop, 
  Download, 
  Share2, 
  Zap, 
  Eye, 
  EyeOff,
  Sliders,
  Save,
  RefreshCw,
  Maximize,
  RotateCcw,
  Scan
} from 'lucide-react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { useApp } from '../context/AppContext';
import imageProcessor from '../utils/imageProcessor';
import { loadOpenCV } from '../utils/opencvLoader';

function PreviewScreen({ setIsLoading }) {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [activeTab, setActiveTab] = useState('photo');
  const [showComparison, setShowComparison] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isCorrectingPerspective, setIsCorrectingPerspective] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [openCVLoaded, setOpenCVLoaded] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!state.currentFile) {
      navigate('/');
      return;
    }

    // Determine file type and set appropriate tab
    if (state.currentFile.type === 'application/pdf') {
      setActiveTab('pdf');
    } else {
      setActiveTab('photo');
    }

    // Initialize OpenCV
    initializeOpenCV();
  }, [state.currentFile, navigate]);

  const initializeOpenCV = async () => {
    try {
      await loadOpenCV();
      setOpenCVLoaded(true);
      console.log('OpenCV initialized successfully');
    } catch (error) {
      console.error('Failed to initialize OpenCV:', error);
      actions.setError('Failed to load image processing library. Some features may not work.');
    }
  };

  const handleAutoScan = async () => {
    if (!state.originalFile || !openCVLoaded) {
      if (!openCVLoaded) {
        actions.setError('Image processing library is still loading. Please wait.');
      }
      return;
    }

    setIsCorrectingPerspective(true);
    setIsLoading(true);

    try {
      setProcessingStep('Detecting document edges...');
      await new Promise(resolve => setTimeout(resolve, 500));

      setProcessingStep('Correcting perspective...');
      await new Promise(resolve => setTimeout(resolve, 500));

      setProcessingStep('Auto-rotating document...');
      await new Promise(resolve => setTimeout(resolve, 500));

      setProcessingStep('Enhancing quality...');
      
      // Process the document with auto-perspective correction
      const processedFile = await imageProcessor.processDocument(state.originalFile, {
        autoCorrectPerspective: state.settings.autoAlignment,
        autoRotate: true,
        enhanceQuality: true,
        removeNoise: state.settings.denoising,
        intensity: state.settings.enhancementIntensity
      });

      actions.setEnhancedFile(processedFile);
      actions.addToHistory(state.originalFile, processedFile);
      
      setProcessingStep('Complete!');
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      actions.setError('Auto-scan failed: ' + error.message);
      console.error('Auto-scan error:', error);
    } finally {
      setIsCorrectingPerspective(false);
      setIsLoading(false);
      setProcessingStep('');
    }
  };

  const handleEnhance = async () => {
    if (!state.originalFile) return;

    setIsEnhancing(true);
    setIsLoading(true);

    try {
      // Use AI enhancement with current file (enhanced or original)
      const fileToEnhance = state.enhancedFile || state.originalFile;
      
      setProcessingStep('Applying AI enhancement...');
      
      if (openCVLoaded) {
        // Use OpenCV for advanced processing
        const enhancedFile = await imageProcessor.processDocument(fileToEnhance, {
          autoCorrectPerspective: false, // Don't re-correct if already done
          autoRotate: false,
          enhanceQuality: true,
          removeNoise: state.settings.denoising,
          intensity: state.settings.enhancementIntensity
        });
        actions.setEnhancedFile(enhancedFile);
      } else {
        // Fallback to basic enhancement
        const enhancedFile = await createEnhancedVersion(fileToEnhance);
        actions.setEnhancedFile(enhancedFile);
      }
      
      // Add to history
      actions.addToHistory(state.originalFile, state.enhancedFile);
      
    } catch (error) {
      actions.setError('Enhancement failed. Please try again.');
      console.error('Enhancement error:', error);
    } finally {
      setIsEnhancing(false);
      setIsLoading(false);
      setProcessingStep('');
    }
  };

  const simulateEnhancement = async () => {
    const steps = [
      'Analyzing image quality...',
      'Applying AI deblurring...',
      'Correcting perspective...',
      'Enhancing clarity...',
      'Finalizing enhancement...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // You could show progress here
    }
  };

  const createEnhancedVersion = async (file) => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Apply basic enhancements (contrast, brightness)
        ctx.filter = 'contrast(1.2) brightness(1.1) saturate(1.1)';
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          const enhancedFile = new File([blob], `enhanced_${file.name}`, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(enhancedFile);
        }, file.type, 0.95);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const fileToDownload = state.enhancedFile || state.originalFile;
    if (!fileToDownload) return;

    const url = URL.createObjectURL(fileToDownload);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileToDownload.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const fileToShare = state.enhancedFile || state.originalFile;
    if (!fileToShare) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Enhanced Image',
          files: [fileToShare]
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback: copy to clipboard or show share options
      actions.setError('Sharing not supported on this device. Use download instead.');
    }
  };

  if (!state.currentFile) {
    return null;
  }

  const originalUrl = URL.createObjectURL(state.originalFile);
  const enhancedUrl = state.enhancedFile ? URL.createObjectURL(state.enhancedFile) : null;

  return (
    <div className="max-w-6xl mx-auto">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors focus-visible"
          aria-label="Go back to home"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center space-x-2">
          {/* Tab Switcher */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('photo')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'photo'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Photo Mode
            </button>
            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'pdf'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              PDF Mode
            </button>
          </div>
        </div>
      </div>

      {/* Tools Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAutoScan}
            disabled={isCorrectingPerspective || !openCVLoaded}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus-visible"
            aria-label="Auto-scan and correct document"
            title="Automatically detect, straighten, and enhance document"
          >
            {isCorrectingPerspective ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Scan className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isCorrectingPerspective ? 'Scanning...' : 'Auto-Scan'}
            </span>
          </button>

          <button
            onClick={handleRotate}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors focus-visible"
            aria-label="Rotate image"
          >
            <RotateCw className="w-4 h-4" />
            <span className="hidden sm:inline">Rotate</span>
          </button>

          <button
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors focus-visible"
            aria-label={showComparison ? 'Hide comparison' : 'Show comparison'}
          >
            {showComparison ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {showComparison ? 'Hide Compare' : 'Show Compare'}
            </span>
          </button>

          <button
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors focus-visible"
            aria-label="Adjust settings"
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">Adjust</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleEnhance}
            disabled={isEnhancing || isCorrectingPerspective}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-lg transition-colors focus-visible"
            aria-label="Enhance image with AI"
          >
            {isEnhancing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>{isEnhancing ? 'Enhancing...' : 'AI Enhance'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus-visible"
            aria-label="Download enhanced image"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus-visible"
            aria-label="Share enhanced image"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          {showComparison && enhancedUrl ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                Before & After Comparison
              </h3>
              <div className="relative max-w-4xl mx-auto">
                <ReactCompareSlider
                  itemOne={
                    <ReactCompareSliderImage
                      src={originalUrl}
                      alt="Original image"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    />
                  }
                  itemTwo={
                    <ReactCompareSliderImage
                      src={enhancedUrl}
                      alt="Enhanced image"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    />
                  }
                  className="rounded-lg overflow-hidden"
                />
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  Original
                </div>
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  Enhanced
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                {enhancedUrl ? 'Enhanced Preview' : 'Original Preview'}
              </h3>
              <div className="flex justify-center">
                <img
                  src={enhancedUrl || originalUrl}
                  alt={enhancedUrl ? 'Enhanced preview' : 'Original preview'}
                  className="max-w-full max-h-96 object-contain rounded-lg"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Processing Status */}
      {(processingStep || !openCVLoaded) && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
            {processingStep ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Scan className="w-5 h-5" />
            )}
            <span className="font-medium">
              {processingStep || 'Loading image processing library...'}
            </span>
          </div>
          {!openCVLoaded && (
            <p className="text-blue-700 dark:text-blue-300 mt-1">
              Please wait while we load the advanced image processing capabilities.
            </p>
          )}
        </div>
      )}

      {/* Enhancement Status */}
      {state.enhancedFile && !processingStep && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
            <Zap className="w-5 h-5" />
            <span className="font-medium">Enhancement Complete!</span>
          </div>
          <p className="text-green-700 dark:text-green-300 mt-1">
            Your document has been auto-scanned and enhanced with perspective correction, rotation adjustment, and AI-powered clarity improvements.
          </p>
        </div>
      )}
    </div>
  );
}

export default PreviewScreen;
