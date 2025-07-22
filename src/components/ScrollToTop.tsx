
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={scrollToTop}
        size="sm"
        className="rounded-full shadow-lg bg-orange-600 hover:bg-orange-700 text-white border-2 border-orange-300 hover:border-orange-400 transition-all duration-300 hover:scale-105 px-4 py-2"
        aria-label="Scroll to top"
      >
        <span className="font-semibold">Top</span>
        <ArrowUp className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default ScrollToTop;