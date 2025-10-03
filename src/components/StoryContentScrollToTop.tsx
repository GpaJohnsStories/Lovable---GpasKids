import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoryContentScrollToTopProps {
  scrollContainerRef: React.RefObject<HTMLElement>;
  targetSelector?: string;
}

const StoryContentScrollToTop: React.FC<StoryContentScrollToTopProps> = ({ scrollContainerRef, targetSelector }) => {
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

  const scrollToTarget = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (targetSelector) {
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Always show button when targetSelector is provided, otherwise check scroll position
  if (!targetSelector && !showButton) return null;

  return (
    <div className="absolute bottom-4 right-4 z-50">
      <Button
        onClick={scrollToTarget}
        type="button"
        size="sm"
        style={{ backgroundColor: '#F97316' }}
        className="rounded-full shadow-lg hover:opacity-90 text-white border-2 border-orange-600 hover:border-orange-500 transition-all duration-300 hover:scale-105 px-4 py-2"
        aria-label={targetSelector ? "Go to Format Menu" : "Scroll to top of story content"}
      >
        <span className="font-bold font-fun">{targetSelector ? "Format Menu" : "Menu"}</span>
        <ArrowUp className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default StoryContentScrollToTop;