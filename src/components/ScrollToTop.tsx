
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
        data-allow-superav-passthrough="true"
        size="sm"
        className="rounded-full shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white border-2 border-orange-600 hover:border-orange-500 transition-all duration-300 hover:scale-105 px-4 py-2 shadow-[0_4px_8px_rgba(0,0,0,0.3),0_2px_4px_rgba(255,140,0,0.4)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.4),0_3px_6px_rgba(255,140,0,0.5)]"
        aria-label="Scroll to top and menu"
      >
        <span className="font-bold font-fun">Top & Menu</span>
        <ArrowUp className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default ScrollToTop;
