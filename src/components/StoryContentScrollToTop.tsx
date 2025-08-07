import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoryContentScrollToTopProps {
  scrollContainerRef: React.RefObject<HTMLElement>;
}

const StoryContentScrollToTop: React.FC<StoryContentScrollToTopProps> = ({ scrollContainerRef }) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setShowButton(scrollContainerRef.current.scrollTop > 100);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [scrollContainerRef]);

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (!showButton) return null;

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <Button
        onClick={scrollToTop}
        size="sm"
        className="rounded-full shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white border-2 border-orange-600 hover:border-orange-500 transition-all duration-300 hover:scale-105 px-4 py-2"
        aria-label="Scroll to top of story content"
      >
        <span className="font-bold font-fun">Menu</span>
        <ArrowUp className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default StoryContentScrollToTop;