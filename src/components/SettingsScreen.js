import React from 'react';
import { 
  Sliders, 
  ToggleLeft, 
  ToggleRight, 
  Type, 
  Contrast, 
  Volume2,
  Save,
  RotateCcw,
  Cloud,
  Shield,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

function SettingsScreen() {
  const { state, actions } = useApp();
  const { settings } = state;

  const handleSettingChange = (key, value) => {
    actions.updateSettings({ [key]: value });
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      actions.updateSettings({
        enhancementIntensity: 'medium',
        autoAlignment: true,
        denoising: true,
        autoSave: false,
        highContrast: false,
        fontSize: 'medium'
      });
    }
  };

  const ToggleSwitch = ({ enabled, onChange, label, description, ariaLabel }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white">{label}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`flex items-center p-1 rounded-full transition-colors focus-visible ${
          enabled 
            ? 'bg-primary-600 hover:bg-primary-700' 
            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
        }`}
        aria-label={ariaLabel}
        role="switch"
        aria-checked={enabled}
      >
        {enabled ? (
          <ToggleRight className="w-6 h-6 text-white" />
        ) : (
          <ToggleLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>
    </div>
  );

  const SelectSetting = ({ value, onChange, options, label, description, icon: Icon }) => (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h3 className="font-medium text-gray-900 dark:text-white">{label}</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{description}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Customize your AI enhancement experience
        </p>
      </div>

      <div className="space-y-8">
        {/* Enhancement Settings */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Enhancement Settings
            </h2>
          </div>
          
          <div className="space-y-4">
            <SelectSetting
              value={settings.enhancementIntensity}
              onChange={(value) => handleSettingChange('enhancementIntensity', value)}
              options={[
                { value: 'low', label: 'Low - Subtle improvements' },
                { value: 'medium', label: 'Medium - Balanced enhancement' },
                { value: 'high', label: 'High - Maximum enhancement' }
              ]}
              label="Enhancement Intensity"
              description="Choose how aggressively the AI should enhance your images"
              icon={Sliders}
            />

            <ToggleSwitch
              enabled={settings.autoAlignment}
              onChange={(value) => handleSettingChange('autoAlignment', value)}
              label="Auto Alignment"
              description="Automatically straighten tilted or skewed documents"
              ariaLabel="Toggle auto alignment"
            />

            <ToggleSwitch
              enabled={settings.denoising}
              onChange={(value) => handleSettingChange('denoising', value)}
              label="Noise Reduction"
              description="Remove grain and noise from images for cleaner results"
              ariaLabel="Toggle noise reduction"
            />

            <ToggleSwitch
              enabled={settings.autoSave}
              onChange={(value) => handleSettingChange('autoSave', value)}
              label="Auto Save"
              description="Automatically save enhanced files to your device"
              ariaLabel="Toggle auto save"
            />
          </div>
        </section>

        {/* Accessibility Settings */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Accessibility
            </h2>
          </div>
          
          <div className="space-y-4">
            <SelectSetting
              value={settings.fontSize}
              onChange={(value) => handleSettingChange('fontSize', value)}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' }
              ]}
              label="Font Size"
              description="Adjust the size of text throughout the application"
              icon={Type}
            />

            <ToggleSwitch
              enabled={settings.highContrast}
              onChange={(value) => {
                handleSettingChange('highContrast', value);
                document.documentElement.classList.toggle('high-contrast', value);
              }}
              label="High Contrast Mode"
              description="Increase contrast for better visibility"
              ariaLabel="Toggle high contrast mode"
            />
          </div>
        </section>

        {/* Cloud & Storage */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Cloud className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Cloud & Storage
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Cloud Sync (Coming Soon)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Sync your enhanced files to Google Drive, Dropbox, or other cloud services
              </p>
              <button
                disabled
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
              >
                Configure Cloud Sync
              </button>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Storage Usage
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {state.processingHistory.length} files in history
              </p>
              <button
                onClick={() => {
                  if (window.confirm('This will clear all processing history. Are you sure?')) {
                    // Clear history logic would go here
                    localStorage.removeItem('processingHistory');
                    window.location.reload();
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors focus-visible"
              >
                Clear History
              </button>
            </div>
          </div>
        </section>

        {/* Performance Settings */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Volume2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Performance
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Processing Quality
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Balance between processing speed and output quality
              </p>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                defaultValue="balanced"
              >
                <option value="fast">Fast - Lower quality, faster processing</option>
                <option value="balanced">Balanced - Good quality and speed</option>
                <option value="quality">Quality - Best quality, slower processing</option>
              </select>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={resetSettings}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors focus-visible"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={() => {
              // Settings are auto-saved, so this is just for user feedback
              const button = document.activeElement;
              const originalText = button.textContent;
              button.textContent = 'Saved!';
              button.disabled = true;
              setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
              }, 2000);
            }}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors focus-visible"
          >
            <Save className="w-5 h-5" />
            <span>Save Settings</span>
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
            About Settings
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Your settings are automatically saved to your browser's local storage. 
            They will persist between sessions but won't sync across different devices or browsers.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SettingsScreen;
