
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ScrollToTop = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/buddys_admin');
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 50);
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

  if (!showButton || isAdminPage) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <Button
        onClick={scrollToTop}
        size="sm"
        className="rounded-full shadow-lg bg-gradient-to-br from-yellow-500/80 to-yellow-600/60 hover:from-yellow-400/80 hover:to-yellow-500/60 text-white border-2 border-yellow-500 hover:border-yellow-400 transition-all duration-300 hover:scale-105 px-4 py-2"
        aria-label="Scroll to top and menu"
      >
        <span className="font-bold font-fun">Top & Menu</span>
        <ArrowUp className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default ScrollToTop;
