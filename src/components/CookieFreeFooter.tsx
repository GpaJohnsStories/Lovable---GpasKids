
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
              className="font-semibold text-sm bg-green-100 hover:bg-green-200 px-2 py-1 rounded transition-colors cursor-pointer"
            >
              🍪 Cookie-Free
            </Link>
          </div>
          
          {/* Right Side */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-amber-600">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-red-500" />
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
