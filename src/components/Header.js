import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  History, 
  Settings, 
  Moon, 
  Sun, 
  Camera
} from 'lucide-react';

function Header({ darkMode, toggleDarkMode }) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home', ariaLabel: 'Go to home page' },
    { path: '/history', icon: History, label: 'History', ariaLabel: 'View processing history' },
    { path: '/settings', icon: Settings, label: 'Settings', ariaLabel: 'Open settings' }
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            aria-label="Simple Photo App - Home"
          >
            <Camera className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">Simple Photo App</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Clean & Fast Photo Viewer</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-1" role="navigation" aria-label="Main navigation">
            {navItems.map(({ path, icon: Icon, label, ariaLabel }) => (
              <Link
                key={path}
                to={path}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible
                  ${location.pathname === path
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
                aria-label={ariaLabel}
                aria-current={location.pathname === path ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span className="hidden md:block">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-2">

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-visible"
              aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
