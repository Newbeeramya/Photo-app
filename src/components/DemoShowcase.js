import React, { useState } from 'react';
import { 
  Scan, 
  RotateCw, 
  Maximize, 
  Zap, 
  ArrowRight,
  CheckCircle,
  Camera,
  FileText
} from 'lucide-react';

function DemoShowcase() {
  const [activeDemo, setActiveDemo] = useState(0);

  const demoSteps = [
    {
      title: "Upload Tilted Document",
      description: "Take a photo of any document, even at weird angles",
      icon: Camera,
      image: "/demo/tilted-document.jpg", // Placeholder
      color: "bg-blue-100 dark:bg-blue-900"
    },
    {
      title: "Auto-Detect Edges",
      description: "AI automatically finds document boundaries",
      icon: Scan,
      image: "/demo/edge-detection.jpg", // Placeholder
      color: "bg-purple-100 dark:bg-purple-900"
    },
    {
      title: "Correct Perspective",
      description: "Transform to perfect front-facing view",
      icon: Maximize,
      image: "/demo/perspective-corrected.jpg", // Placeholder
      color: "bg-green-100 dark:bg-green-900"
    },
    {
      title: "Enhance Quality",
      description: "AI-powered clarity and sharpening",
      icon: Zap,
      image: "/demo/enhanced-result.jpg", // Placeholder
      color: "bg-yellow-100 dark:bg-yellow-900"
    }
  ];

  const features = [
    {
      icon: Scan,
      title: "Smart Document Detection",
      description: "Automatically identifies document edges even in complex backgrounds"
    },
    {
      icon: RotateCw,
      title: "Auto-Rotation",
      description: "Detects text orientation and rotates for optimal readability"
    },
    {
      icon: Maximize,
      title: "Perspective Correction",
      description: "Transforms skewed images into perfect rectangular documents"
    },
    {
      icon: Zap,
      title: "AI Enhancement",
      description: "Improves clarity, contrast, and removes noise automatically"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Smart Auto-Scan Technology
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Transform any poorly taken photo into a professional-looking scan with our 
          advanced AI-powered perspective correction and enhancement system.
        </p>
      </div>

      {/* Demo Steps */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {demoSteps.map((step, index) => (
          <div
            key={index}
            className={`relative p-6 rounded-xl transition-all duration-300 cursor-pointer ${
              activeDemo === index 
                ? 'transform scale-105 shadow-lg ring-2 ring-primary-500' 
                : 'hover:transform hover:scale-102 hover:shadow-md'
            } ${step.color}`}
            onClick={() => setActiveDemo(index)}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-lg mb-4 shadow-sm">
                <step.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
            </div>
            
            {/* Step number */}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
            
            {/* Arrow connector */}
            {index < demoSteps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Demo Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Step {activeDemo + 1}: {demoSteps[activeDemo].title}
          </h3>
          <div className="flex items-center space-x-2">
            {demoSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveDemo(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeDemo === index 
                    ? 'bg-primary-600' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            {React.createElement(demoSteps[activeDemo].icon, {
              className: "w-16 h-16 text-gray-400 mx-auto mb-4"
            })}
            <p className="text-gray-500 dark:text-gray-400">
              Demo preview for: {demoSteps[activeDemo].description}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Upload a real document to see this in action!
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <feature.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
          <CheckCircle className="w-5 h-5" />
          <span>Try Auto-Scan Now - Upload Your First Document!</span>
        </div>
      </div>
    </div>
  );
}

export default DemoShowcase;
