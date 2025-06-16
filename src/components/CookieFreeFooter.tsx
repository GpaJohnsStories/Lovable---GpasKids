
import React from 'react';
import { Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieFreeFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-amber-100 border-t border-amber-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Left Side */}
          <div className="flex items-center space-x-2 text-green-700">
            <Shield className="h-4 w-4" />
            <Link 
              to="/privacy"
              onClick={scrollToTop}
            >
              <button className="bg-gradient-to-b from-green-400 to-green-600 text-white px-3 py-2 rounded-lg font-semibold shadow-[0_6px_12px_rgba(22,101,52,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] border border-green-700 transition-all duration-200 hover:shadow-[0_8px_16px_rgba(22,101,52,0.4),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)] text-sm">
                🍪 Cookie-Free
              </button>
            </Link>
          </div>
          
          {/* Right Side */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-amber-600">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500" strokeWidth={3} />
              <span>for children</span>
            </div>
            <div className="text-amber-600 font-medium">
              © 2025 Grandpa John's Stories
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CookieFreeFooter;
