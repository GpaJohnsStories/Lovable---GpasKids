
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!showButton) return null;

  return (
    <>
      {/* Bottom left button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 left-8 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 z-50 flex items-center gap-2"
        style={{ fontFamily: "'Kalam', 'Caveat', cursive, sans-serif" }}
      >
        <span className="font-semibold">Top</span>
        <ArrowUp className="h-4 w-4" />
      </button>

      {/* Halfway down left side button */}
      <button
        onClick={scrollToTop}
        className="fixed top-1/2 left-8 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 z-50 flex items-center gap-2"
        style={{ fontFamily: "'Kalam', 'Caveat', cursive, sans-serif" }}
      >
        <span className="font-semibold">Top</span>
        <ArrowUp className="h-4 w-4" />
      </button>
    </>
  );
};

export default ScrollToTop;
