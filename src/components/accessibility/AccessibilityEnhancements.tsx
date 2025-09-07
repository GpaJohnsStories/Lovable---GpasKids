import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface AccessibilityEnhancementsProps {
  children: React.ReactNode;
}

export const AccessibilityEnhancements: React.FC<AccessibilityEnhancementsProps> = ({ children }) => {
  const location = useLocation();
  const [announceText, setAnnounceText] = useState('');

  // Announce page changes to screen readers
  useEffect(() => {
    const getPageTitle = (pathname: string) => {
      switch (pathname) {
        case '/':
          return 'Home page - Welcome to Grandpa John\'s Story Corner';
        case '/stories':
          return 'Stories page - Browse all available stories';
        case '/about':
          return 'About page - Learn more about Grandpa John\'s Story Corner';
        case '/writing':
          return 'Writing page - Create and submit your own stories';
        case '/library':
          return 'Library page - Explore our story collection';
        case '/guide':
          return 'Guide page - Learn how to use this website';
        case '/club':
          return 'Club page - Join our reading community';
        default:
          return `Page loaded: ${pathname.replace('/', '').replace('-', ' ')}`;
      }
    };

    const title = getPageTitle(location.pathname);
    setAnnounceText(title);

    // Clear the announcement after screen readers have had time to read it
    const timer = setTimeout(() => setAnnounceText(''), 3000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {/* Screen reader announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {announceText}
      </div>

      {/* Skip navigation links */}
      <div className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50">
        <a
          href="#main-content"
          className="bg-primary text-primary-foreground px-4 py-2 rounded font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <a
          href="#main-menu"
          className="bg-primary text-primary-foreground px-4 py-2 rounded font-semibold text-lg ml-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
        >
          Skip to navigation menu
        </a>
      </div>

      {/* Main content wrapper with proper landmarks */}
      <div role="main" id="main-content">
        {children}
      </div>
    </>
  );
};


// Font size controls for better readability
export const FontSizeControls: React.FC = () => {
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const saved = localStorage.getItem('font-size');
    if (saved) {
      const size = parseInt(saved, 10);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}px`;
    }
  }, []);

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(14, Math.min(28, fontSize + delta));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
    localStorage.setItem('font-size', newSize.toString());
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border-2 border-gray-300 rounded-lg p-2 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-gray-800">Text Size:</span>
        <button
          onClick={() => changeFontSize(-2)}
          className="w-8 h-8 bg-blue-500 text-white rounded font-bold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Decrease text size"
          title="Make text smaller"
        >
          A-
        </button>
        <span className="text-sm font-mono w-8 text-center">{fontSize}</span>
        <button
          onClick={() => changeFontSize(2)}
          className="w-8 h-8 bg-blue-500 text-white rounded font-bold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Increase text size"
          title="Make text larger"
        >
          A+
        </button>
      </div>
    </div>
  );
};

// Screen reader friendly image wrapper
interface AccessibleImageProps {
  src: string;
  alt: string;
  className?: string;
  decorative?: boolean;
  longDescription?: string;
}

export const AccessibleImage: React.FC<AccessibleImageProps> = ({
  src,
  alt,
  className,
  decorative = false,
  longDescription
}) => {
  const descriptionId = longDescription ? `img-desc-${Math.random().toString(36).substr(2, 9)}` : undefined;

  return (
    <>
      <img
        src={src}
        alt={decorative ? '' : alt}
        className={className}
        aria-describedby={descriptionId}
        role={decorative ? 'presentation' : undefined}
      />
      {longDescription && (
        <div id={descriptionId} className="sr-only">
          {longDescription}
        </div>
      )}
    </>
  );
};