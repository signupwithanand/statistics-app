import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsHelpVisible(false);
      }
    };

    if (isHelpVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHelpVisible]);

  return (
    <>
      <header className="h-20 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl">📊</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                StatPlayground
              </h1>
              <p className="text-sm text-gray-600">Visual Statistics Learning Platform</p>
            </div>
          </div>

          <div className="relative flex items-center space-x-2">
            <button
              onClick={() => setIsHelpVisible(!isHelpVisible)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Small Help Tooltip */}
            {isHelpVisible && (
              <div
                ref={tooltipRef}
                className="absolute right-full top-0 mt-2 mr-2 bg-white rounded-lg shadow-lg border p-4 w-80 z-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-sm text-gray-900">Quick Help</h3>
                  <button
                    onClick={() => setIsHelpVisible(false)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start space-x-2">
                    <span className="font-medium text-blue-600 flex-shrink-0">1.</span>
                    <span>Click "Generate 5/10" to create numbers that fall from the sky</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-medium text-blue-600 flex-shrink-0">2.</span>
                    <span>Watch the animation and explore different statistics</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-medium text-blue-600 flex-shrink-0">3.</span>
                    <span>Click any stat button for step-by-step calculations</span>
                  </div>
                </div>

                {/* Arrow pointing to the button */}
                <div className="absolute right-[-6px] top-4 rotate-45 bg-white border-r border-t w-3 h-3"></div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
