import React, { createContext, useContext, useState } from 'react';

// Create context
const AppContext = createContext();

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// App Provider component
export const AppProvider = ({ children }) => {
  const [currentFile, setCurrentFile] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [processingHistory, setProcessingHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('photoAppSettings');
    return saved ? JSON.parse(saved) : {
      autoSave: false,
      fontSize: 'medium'
    };
  });

  // Action functions
  const actions = {
    setCurrentFile: (file) => {
      setCurrentFile(file);
      setError(null);
    },
    setOriginalFile,
    addToHistory: (item) => {
      const newItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        originalFile: item.originalFile,
        processingType: item.processingType || 'enhancement'
      };
      setProcessingHistory(prev => [newItem, ...prev].slice(0, 50));
    },
    updateSettings: (newSettings) => {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      localStorage.setItem('photoAppSettings', JSON.stringify(updated));
    },
    setProcessing: setIsProcessing,
    setError,
    setUploadProgress,
    clearFiles: () => {
      setCurrentFile(null);
      setOriginalFile(null);
      setUploadProgress(0);
      setError(null);
    },
    removeFromHistory: (id) => {
      setProcessingHistory(prev => prev.filter(item => item.id !== id));
    }
  };

  const value = {
    currentFile,
    originalFile,
    processingHistory,
    isProcessing,
    error,
    uploadProgress,
    settings,
    actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};


