
import React from 'react';
import { Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieFreeFooter = () => {
  return (
    <footer className="bg-amber-100 border-t border-amber-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          {/* Cookie-Free Badge */}
          <div className="flex justify-center items-center space-x-2 text-green-700">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">🍪 100% Cookie-Free Website</span>
          </div>
          
          <p className="text-amber-700 max-w-2xl mx-auto">
            Grandpa's Story Corner respects your privacy. We don't use cookies, tracking, 
            or analytics. Just pure, heartwarming stories for you to enjoy.
          </p>

          <div className="flex justify-center space-x-6 text-sm">
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
              Privacy Policy
            </Link>
            <Link 
              to="/admin" 
              className="text-amber-600 hover:text-amber-800 underline"
            >
              Admin Access
            </Link>
          </div>

          <div className="flex justify-center items-center space-x-1 text-amber-600 pt-4">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>by Grandpa's Story Corner</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CookieFreeFooter;
