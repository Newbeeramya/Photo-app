import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, RotateCw, Download, Zap } from 'lucide-react';

function PreviewScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rotation, setRotation] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState(null);
  const canvasRef = useRef(null);
  
  // Get image from navigation state
  const fileData = location.state?.fileData;
  const imageFile = fileData?.file;

  useEffect(() => {
    if (!fileData || !imageFile) {
      navigate('/');
      return;
    }
  }, [fileData, imageFile, navigate]);

  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleEnhance = async () => {
    if (!imageFile || imageFile.type === 'application/pdf') {
      alert('Enhancement is only available for image files.');
      return;
    }

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply enhancements
        for (let i = 0; i < data.length; i += 4) {
          // Increase brightness by 20
          data[i] = Math.min(255, data[i] + 20);     // Red
          data[i + 1] = Math.min(255, data[i + 1] + 20); // Green
          data[i + 2] = Math.min(255, data[i + 2] + 20); // Blue
          
          // Increase contrast by 10%
          data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.1 + 128));
          data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.1 + 128));
          data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.1 + 128));
        }
        
        // Put enhanced image data back
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to blob and create URL
        canvas.toBlob((blob) => {
          const enhancedUrl = URL.createObjectURL(blob);
          setEnhancedImageUrl(enhancedUrl);
          setEnhanced(true);
        }, 'image/jpeg', 0.9);
      };
      
      img.src = imageUrl;
    } catch (error) {
      console.error('Enhancement failed:', error);
      alert('Enhancement failed. Please try again.');
    }
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

  if (!fileData || !imageFile) {
    return null;
  }

  const imageUrl = fileData.url || URL.createObjectURL(imageFile);
  const displayUrl = enhanced && enhancedImageUrl ? enhancedImageUrl : imageUrl;

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
                  src={displayUrl}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
                {enhanced && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                    Enhanced
                  </div>
                )}
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
                disabled={enhanced}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  enhanced 
                    ? 'bg-green-600 text-white cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>{enhanced ? 'Enhanced!' : 'Enhance'}</span>
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

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default PreviewScreen;
