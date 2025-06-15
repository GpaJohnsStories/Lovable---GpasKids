
import React from 'react';
import { Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieFreeFooter = () => {
  return (
    <footer className="bg-amber-100 border-t border-amber-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Left Side */}
          <div className="flex items-center space-x-2 text-green-700">
            <Shield className="h-4 w-4" />
            <Link 
              to="/privacy"
              className="font-semibold text-sm bg-green-100 hover:bg-green-200 px-2 py-1 rounded transition-colors cursor-pointer"
            >
              🍪 Cookie-Free
            </Link>
          </div>
          
          {/* Middle - Navigation Links */}
          <div className="flex items-center space-x-6 text-sm">
            <Link 
              to="/" 
              className="text-amber-600 hover:text-amber-800 underline"
            >
              Stories
            </Link>
            <Link 
              to="/privacy" 
              className="text-amber-600 hover:text-amber-800 underline"
            >
              Privacy
            </Link>
            <a 
              href="https://gpaskids.com/buddys_admin" 
              className="text-amber-600 hover:text-amber-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Admin
            </a>
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
