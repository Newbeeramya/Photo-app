import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Removed OpenCV dependency to prevent memory issues

// Components
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import PreviewScreen from './components/PreviewScreen';
import HistoryScreen from './components/HistoryScreen';
import SettingsScreen from './components/SettingsScreen';
import LoadingSpinner from './components/LoadingSpinner';

// Context
import { AppProvider } from './context/AppContext';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for user's theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // App initialization complete
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <AppProvider>
      <Router>
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          
          {isLoading && <LoadingSpinner />}
          
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomeScreen setIsLoading={setIsLoading} />} />
              <Route path="/preview" element={<PreviewScreen setIsLoading={setIsLoading} />} />
              <Route path="/history" element={<HistoryScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
