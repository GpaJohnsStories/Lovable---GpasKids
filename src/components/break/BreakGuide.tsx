import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useCachedIcon } from '@/hooks/useCachedIcon';
import { BreakTimerPopup } from '../BreakTimerPopup';
import { useBreakTimer } from '@/contexts/BreakTimerContext';
const BreakGuide: React.FC = () => {
  const { minutesLeft, isBreakReminderOpen, openBreakReminder, closeBreakReminder, onBreakComplete, isTimerActive } = useBreakTimer();
  
  const [isBreakTimerOpen, setIsBreakTimerOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  
  // SYS-BT2: Back Door functionality - Break Reminder access via triple-click
  const [sparkyClickCount, setSparkyClickCount] = useState(0);
  const [sparkyClickTimer, setSparkyClickTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Get close icon for the Break Timer
  const {
    iconUrl: closeIconUrl
  } = useCachedIcon('!CO-CLS.jpg');

  // Get Sparky icon for the Break Timer
  const {
    iconUrl: sparkyIconUrl,
    iconName: sparkyName
  } = useCachedIcon('!CO-SPT.gif');

  // Get Break Guide icon for the button
  const {
    iconUrl: breakGuideIconUrl,
    iconName: breakGuideName
  } = useCachedIcon('!CO-BRK.gif');

  // Timer is now managed by context, no local countdown needed
  
  const handleBreakButtonClick = () => {
    setIsBreakTimerOpen(true);
  };
  const handleCloseBreakTimer = () => {
    setIsBreakTimerOpen(false);
    setPosition({ x: 0, y: 0 }); // Reset position when closing
  };

  // SYS-BT2: Back Door - Triple-click Sparky to open Break Reminder instantly
  const handleSparkyClick = () => {
    setSparkyClickCount(prev => prev + 1);
    
    // Clear existing timer
    if (sparkyClickTimer) {
      clearTimeout(sparkyClickTimer);
    }
    
    // Set new timer to reset click count after 1 second
    const timer = setTimeout(() => {
      setSparkyClickCount(0);
    }, 1000);
    setSparkyClickTimer(timer);
    
    // Check for triple-click (3 clicks within 1 second)
    if (sparkyClickCount === 2) { // This will be the 3rd click
      openBreakReminder();
      setSparkyClickCount(0); // Reset click counter
      if (sparkyClickTimer) {
        clearTimeout(sparkyClickTimer);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (sparkyClickTimer) {
        clearTimeout(sparkyClickTimer);
      }
    };
  }, [sparkyClickTimer]);
  // Don't render if timer is not active (e.g., on admin pages)
  if (!isTimerActive) {
    return null;
  }

  return <TooltipProvider delayDuration={200}>
      {/* Break Button - positioned bottom-left, same height and alignment as "Top & Menu" button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={handleBreakButtonClick}
            data-allow-superav-passthrough="true"
            className="fixed bottom-20 left-4 z-50 cursor-pointer transition-all duration-300 hover:scale-105 print:hidden"
            aria-label="Break Guide"
            data-testid="break-button"
          >
            {breakGuideIconUrl ? (
              <img 
                src={breakGuideIconUrl} 
                alt={breakGuideName ?? 'Break Guide'} 
                className="w-[65px] h-[65px] object-contain"
              />
            ) : (
              <span className="font-bold font-fun text-21px">Break Guide</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-fun text-21px font-bold">Break Timer</p>
        </TooltipContent>
      </Tooltip>

      {/* Break Timer Panel - same width as SuperAV, extended height for SYS-BT2 code */}
      {isBreakTimerOpen && <div 
        ref={panelRef}
        className="fixed w-[288px] h-[520px] border-2 border-[#228B22] bg-green-100 z-50 flex flex-col shadow-xl select-none"
        style={{
          left: `calc(50% + ${position.x}px)`,
          top: `calc(50% + ${position.y}px)`,
          transform: 'translate(-50%, -50%)',
          borderRadius: '16px', // Same as SuperAV rounded corners
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        data-testid="break-timer">
          {/* Draggable header areas - leave a hole over Sparky (top-left ~90x90) */}
          {/* Top strip excluding Sparky area */}
          <div
            className="absolute top-0 right-0 h-[90px] left-[90px] cursor-grab active:cursor-grabbing z-30"
            onMouseDown={handleMouseDown}
          />
          {/* Main area below Sparky */}
          <div
            className="absolute top-[90px] left-0 right-0 bottom-12 cursor-grab active:cursor-grabbing z-30"
            onMouseDown={handleMouseDown}
          />
          {/* Screen panel that almost fills the dialog */}
          <div className="flex-1 m-2 mb-2 bg-white relative overflow-hidden" style={{
        border: '2px solid #5A3E2B',
        borderRadius: '16px', // Same rounded corners as outer dialog
        boxShadow: 'inset 0 0 0 2px #A67C52, inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)'
      }}>
            {/* Sparky icon in top left corner with tooltip - SYS-BT2: Triple-click for Back Door access */}
            {sparkyIconUrl && <div 
                className="absolute top-2 left-2 z-20 cursor-pointer hover:scale-105 transition-transform"
                onClick={handleSparkyClick}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <img src={sparkyIconUrl} alt={sparkyName ?? 'Sparky'} style={{
                width: '75px',
                height: '75px',
                objectFit: 'contain'
              }} />
                  </TooltipTrigger>
                  <TooltipContent className="whitespace-nowrap">
                    {sparkyName ?? 'Sparky -- Official Break Timer (Triple-click for instant Break Reminder)'}
                  </TooltipContent>
                </Tooltip>
              </div>}
            
            {/* Paper texture overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: "url('/lovable-uploads/paper-texture.png')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }} />
            
            {/* Screen content */}
            <div className="relative z-10 h-full flex flex-col p-2">
              {/* Top row with Sparky and "Next Break In —" */}
              <div className="flex items-start justify-end mb-4 px-1">
                {/* "Next Break In —" right-aligned */}
                <div className="font-kalam text-lg font-bold whitespace-nowrap text-right" style={{
              color: '#228B22'
            }}>
                  Next Break In —
                </div>
              </div>
              
              {/* Countdown Timer */}
              <div className="font-kalam text-4xl font-bold mb-6 text-right pr-1" style={{
            color: '#228B22'
          }}>
                {minutesLeft} Minutes
              </div>
              
              {/* New break message */}
              <div className="text-center">
                <p className="font-kalam text-lg leading-tight mb-3" style={{
              color: '#228B22'
            }}>
                  Grandpa John asked me, Sparky, to be the Official Break Timer to help you keep track of your time on our website. He's learned that taking little breaks helps your eyes stay happy and your brain stay focused. It's a smart habit for everyone, no matter your age!
                </p>
                <p className="font-kalam text-base leading-tight" style={{
              color: '#228B22'
             }}>When timer reaches 0, I will remind you to take a short break.</p>
              </div>
              
              {/* SYS-BT2 code in bottom right corner */}
              <div className="absolute bottom-2 right-2">
                <span className="font-kalam text-xs font-bold" style={{ color: '#228B22' }}>
                  SYS-BT2
                </span>
              </div>
            </div>
          </div>
          
          {/* Close button row at bottom - full width like SuperAV */}
          <div className="h-12">
            <button onClick={handleCloseBreakTimer} className="w-full h-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 hover:from-gray-300 hover:via-gray-400 hover:to-gray-500 border border-gray-400 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center">
              {closeIconUrl ? <img src={closeIconUrl} alt="Close" style={{
            height: '60px',
            width: '100%',
            objectFit: 'fill'
          }} /> : <span className="text-gray-700 font-semibold">Close</span>}
            </button>
          </div>
        </div>}

      {/* SYS-BT2: Break Reminder popup - managed by context */}
      <BreakTimerPopup 
        isOpen={isBreakReminderOpen}
        onClose={closeBreakReminder}
        onBreakComplete={onBreakComplete}
      />

    </TooltipProvider>;
};
export default BreakGuide;