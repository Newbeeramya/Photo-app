import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  currentFile: null,
  originalFile: null,
  enhancedFile: null,
  processingHistory: [],
  settings: {
    enhancementIntensity: 'medium', // low, medium, high
    autoAlignment: true,
    denoising: true,
    autoSave: false,
    highContrast: false,
    fontSize: 'medium' // small, medium, large
  },
  isProcessing: false,
  error: null,
  uploadProgress: 0
};

// Action types
const ActionTypes = {
  SET_CURRENT_FILE: 'SET_CURRENT_FILE',
  SET_ORIGINAL_FILE: 'SET_ORIGINAL_FILE',
  SET_ENHANCED_FILE: 'SET_ENHANCED_FILE',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  SET_PROCESSING: 'SET_PROCESSING',
  SET_ERROR: 'SET_ERROR',
  SET_UPLOAD_PROGRESS: 'SET_UPLOAD_PROGRESS',
  CLEAR_FILES: 'CLEAR_FILES',
  REMOVE_FROM_HISTORY: 'REMOVE_FROM_HISTORY'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_FILE:
      return { ...state, currentFile: action.payload, error: null };
    
    case ActionTypes.SET_ORIGINAL_FILE:
      return { ...state, originalFile: action.payload };
    
    case ActionTypes.SET_ENHANCED_FILE:
      return { ...state, enhancedFile: action.payload };
    
    case ActionTypes.ADD_TO_HISTORY:
      const newHistoryItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        originalFile: action.payload.originalFile,
        enhancedFile: action.payload.enhancedFile,
        settings: { ...state.settings }
      };
      return {
        ...state,
        processingHistory: [newHistoryItem, ...state.processingHistory.slice(0, 49)] // Keep last 50 items
      };
    
    case ActionTypes.UPDATE_SETTINGS:
      const updatedSettings = { ...state.settings, ...action.payload };
      localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      return { ...state, settings: updatedSettings };
    
    case ActionTypes.SET_PROCESSING:
      return { ...state, isProcessing: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    
    case ActionTypes.SET_UPLOAD_PROGRESS:
      return { ...state, uploadProgress: action.payload };
    
    case ActionTypes.CLEAR_FILES:
      return {
        ...state,
        currentFile: null,
        originalFile: null,
        enhancedFile: null,
        uploadProgress: 0,
        error: null
      };
    
    case ActionTypes.REMOVE_FROM_HISTORY:
      return {
        ...state,
        processingHistory: state.processingHistory.filter(item => item.id !== action.payload)
      };
    
    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Context provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: settings });
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }

    // Load processing history from localStorage
    const savedHistory = localStorage.getItem('processingHistory');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        history.forEach(item => {
          dispatch({ type: ActionTypes.ADD_TO_HISTORY, payload: item });
        });
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (state.processingHistory.length > 0) {
      localStorage.setItem('processingHistory', JSON.stringify(state.processingHistory));
    }
  }, [state.processingHistory]);

  // Action creators
  const actions = {
    setCurrentFile: (file) => dispatch({ type: ActionTypes.SET_CURRENT_FILE, payload: file }),
    setOriginalFile: (file) => dispatch({ type: ActionTypes.SET_ORIGINAL_FILE, payload: file }),
    setEnhancedFile: (file) => dispatch({ type: ActionTypes.SET_ENHANCED_FILE, payload: file }),
    addToHistory: (originalFile, enhancedFile) => dispatch({ 
      type: ActionTypes.ADD_TO_HISTORY, 
      payload: { originalFile, enhancedFile } 
    }),
    updateSettings: (settings) => dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: settings }),
    setProcessing: (isProcessing) => dispatch({ type: ActionTypes.SET_PROCESSING, payload: isProcessing }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    setUploadProgress: (progress) => dispatch({ type: ActionTypes.SET_UPLOAD_PROGRESS, payload: progress }),
    clearFiles: () => dispatch({ type: ActionTypes.CLEAR_FILES }),
    removeFromHistory: (id) => dispatch({ type: ActionTypes.REMOVE_FROM_HISTORY, payload: id })
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export { ActionTypes };
