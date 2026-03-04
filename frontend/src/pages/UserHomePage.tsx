import React, { useState, useEffect } from 'react';
import Orb from '../components/home/Orb';

function UserHomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    document.title = 'Home - NeuralForge';
  }, []);

  const networkOptions = [
    {
      id: 1,
      title: "Image Recognizer CNN",
      description: "Build convolutional neural networks for image classification and object detection. Perfect for computer vision projects.",
      status: "active",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg> // temporary svg icon 1
      ),
      href: "/dashboard"
    },
    {
      id: 2,
      title: "Learn more in the user forum.",
      description: "The user forum is a place where you can ask questions and share your knowledge with other users.",
      status: "inactive",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg> // temporary svg icon 2
      ),
      href: "/forum"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#060010] text-white pt-24 px-6 relative">
      {/* todo fix naming of "orb" */}
      <div>
        <Orb />
      </div>

      {/* Content with higher z-index - moved to left */}
      <div className="max-w-2xl mx-0 relative z-10">
        {/* Header - aligned left */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono text-left">
            Welcome back!
          </h1>
          <p className="text-gray-400 text-lg mb-12 text-left">
            Choose a network to begin with
          </p>
        </div>

        {/* Network Options Grid - single column */}
        <div className="grid gap-8 mb-20">
          {networkOptions.map((option, idx) => (
            <div
              key={option.id}
              className={`bg-gradient-to-b from-gray-900/50 to-transparent border rounded-xl p-6 transition-all duration-300 cursor-pointer ${option.status === 'active'
                ? 'border-gray-700 hover:border-purple-500 hover:shadow-lg hover:shadow-blue-500/20'
                : 'border-gray-800 opacity-60'
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              style={{ transitionDelay: `${200 + idx * 100}ms` }}
              onClick={() => option.status === 'active' && (window.location.href = option.href)}
            >
              <div className="flex items-start gap-4">
                <div className={`text-2xl p-3 rounded-lg ${option.status === 'active' ? 'bg-blue-500/20' : 'bg-gray-700/50'
                  }`}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{option.title}</h3>
                    {option.status === 'coming-soon' && (
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    {option.description}
                  </p>
                  {option.status === 'active' ? (
                    <a
                      href={option.href}
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      Work in Progress
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-gray-500 font-medium">
                      Available Soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats - aligned left */}
        <div
          className={`border-t border-gray-800 pt-12 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          style={{ transitionDelay: '500ms' }}
        >
          <div className="grid grid-cols-3 gap-8 text-left">
            {/* }
            <div>
              <div className="text-2xl font-bold mb-2">0</div>
              <div className="text-gray-400 text-sm">Models Created</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">0</div>
              <div className="text-gray-400 text-sm">Training Jobs</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">1</div>
              <div className="text-gray-400 text-sm">Network Types</div>
            </div>
             */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHomePage;