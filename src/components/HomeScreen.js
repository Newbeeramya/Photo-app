import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  Camera, 
  FileImage, 
  CheckCircle,
  Maximize
} from 'lucide-react';

function HomeScreen({ setIsLoading }) {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image (JPEG, PNG, WebP) or PDF file.');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB.');
        return;
      }

      setIsLoading(true);
      
      // Create file URL for preview
      const fileUrl = URL.createObjectURL(file);
      const fileData = {
        file,
        url: fileUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      };
      
      // Add to uploaded files
      setUploadedFiles(prev => [fileData, ...prev]);
      
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setIsLoading(false);
      navigate('/preview', { state: { fileData } });
    }
  }, [navigate, setIsLoading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'application/pdf': ['.pdf']
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  });

  const handleCameraCapture = () => {
    // This would typically open camera interface
    // For now, we'll trigger file input
    document.getElementById('camera-input').click();
  };

  const features = [
    {
      icon: FileImage,
      title: 'Photo Upload',
      description: 'Upload and view your photos in a clean, simple interface'
    },
    {
      icon: Maximize,
      title: 'Photo Preview',
      description: 'View your photos in full size with basic rotation options'
    },
    {
      icon: CheckCircle,
      title: 'Simple & Fast',
      description: 'Lightweight app that loads quickly without heavy processing'
    },
    {
      icon: Camera,
      title: 'Easy Access',
      description: 'Drag & drop or click to upload photos from your device'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Simple Photo App
          <span className="block text-primary-600 dark:text-primary-400">Clean & Fast Photo Viewer</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Upload, view, and manage your photos with ease. A lightweight, fast photo gallery 
          that works reliably without complex processing or heavy dependencies.
        </p>
      </div>

      {/* Features showcase removed for simplicity */}

      {/* Upload Section */}
      <div className="mb-12">
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
            ${isDragActive || dragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }
          `}
          role="button"
          tabIndex={0}
          aria-label="Upload files by clicking or dragging and dropping"
        >
          <input {...getInputProps()} />
          <input
            id="camera-input"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              if (e.target.files.length > 0) {
                onDrop([e.target.files[0]]);
              }
            }}
          />
          
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-primary-100 dark:bg-primary-900 rounded-full">
                <Upload className="w-12 h-12 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {isDragActive ? 'Drop your files here' : 'Upload Photo or PDF'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Drag and drop your files here, or click to browse
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supports JPEG, PNG, WebP, and PDF files up to 10MB
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  document.querySelector('input[type="file"]').click();
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors focus-visible"
                aria-label="Choose files from device"
              >
                <FileImage className="w-5 h-5 mr-2" />
                Choose Files
              </button>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCameraCapture();
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors focus-visible"
                aria-label="Take photo with camera"
              >
                <Camera className="w-5 h-5 mr-2" />
                Take Photo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4">
              <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* File Type Support */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Works with Any Document Type
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
            <FileImage className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Photos & Images</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
            <FileImage className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">PDF Documents</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
            <FileImage className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">All File Types</span>
          </div>
        </div>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Supports JPEG, PNG, WebP, and PDF files up to 10MB
        </p>
      </div>
    </div>
  );
}

export default HomeScreen;
