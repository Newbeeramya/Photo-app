import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, RotateCw, Download, Zap } from 'lucide-react';

function PreviewScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  
  // Get image from navigation state
  const imageFile = location.state?.file;

  useEffect(() => {
    if (!imageFile) {
      navigate('/');
      return;
    }
  }, [imageFile, navigate]);

  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleEnhance = () => {
    // Simple enhancement - just show a success message
    alert('Photo enhanced! (Demo feature)');
  };

  const handleDownload = () => {
    if (!imageFile) return;

    const url = URL.createObjectURL(imageFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = imageFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!imageFile) {
    return null;
  }

  const imageUrl = URL.createObjectURL(imageFile);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Photo Preview
              </h2>
            </div>
            
            <div className="p-6">
              <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={processedImage || imageUrl}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Photo Tools
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={handleEnhance}
                disabled={isProcessing}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span>{isProcessing ? 'Processing...' : 'Enhance'}</span>
              </button>
              
              <button
                onClick={rotateImage}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCw className="w-4 h-4" />
                <span>Rotate</span>
              </button>
            </div>
          </div>

          {/* File Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">File Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="text-gray-900 font-medium">{imageFile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Size:</span>
                <span className="text-gray-900">{(imageFile.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="text-gray-900">{imageFile.type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span className="font-medium">Processing image...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PreviewScreen;
