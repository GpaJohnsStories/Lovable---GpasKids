import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCachedIcon } from '@/hooks/useCachedIcon';

const BreakGuide: React.FC = () => {
  const [isBreakTimerOpen, setIsBreakTimerOpen] = useState(false);
  const [isBreakReminderOpen, setIsBreakReminderOpen] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState(15); // Default 15 minutes
  
  // Get close icon for the Break Timer
  const { iconUrl: closeIconUrl } = useCachedIcon('!CO-CLS.jpg');
  
  // Get Sparky icon for the Break Timer
  const { iconUrl: sparkyIconUrl } = useCachedIcon('!CO-SPT.gif');

  // Countdown timer effect
  useEffect(() => {
    if (!isBreakTimerOpen) return;
    
    const timer = setInterval(() => {
      setMinutesLeft(prev => {
        if (prev <= 1) {
          // Timer reached zero, could trigger break reminder here
          return 15; // Reset to 15 minutes
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [isBreakTimerOpen]);

  const handleBreakButtonClick = () => {
    setIsBreakTimerOpen(true);
  };

  const handleCloseBreakTimer = () => {
    setIsBreakTimerOpen(false);
  };

  return (
    <>
      {/* Break Button - positioned bottom-left, same height and alignment as "Top & Menu" button */}
      <button
        className="fixed bottom-20 left-4 z-50 bg-gradient-to-b from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white px-4 py-2 rounded-full border-2 border-[#228B22] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 font-bold font-fun"
        onClick={handleBreakButtonClick}
        data-allow-superav-passthrough="true"
        data-testid="break-button"
      >
        Break Guide
      </button>

      {/* Break Timer Dialog - same width as SuperAV, half height, with lighter green background */}
      <Dialog open={isBreakTimerOpen} onOpenChange={setIsBreakTimerOpen}>
        <DialogContent 
          className="w-[288px] h-[490px] max-w-none border-2 border-[#228B22] bg-green-100 p-0 gap-0 flex flex-col [&>button]:hidden"
          data-testid="break-timer"
        >
          {/* Screen panel that almost fills the dialog */}
          <div className="flex-1 m-2 mb-2 bg-white rounded relative overflow-hidden" style={{
            border: '2px solid #5A3E2B',
            boxShadow: 'inset 0 0 0 2px #A67C52, inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)'
          }}>
            {/* Sparky icon in top left corner */}
            {sparkyIconUrl && (
              <div className="absolute top-2 left-2 z-20">
                <img 
                  src={sparkyIconUrl} 
                  alt="Sparky" 
                  style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                />
              </div>
            )}
            
            {/* Paper texture overlay */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "url('/lovable-uploads/paper-texture.png')",
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
              }}
            />
            
            {/* Screen content */}
            <div className="relative z-10 h-full flex flex-col p-4">
              {/* Top row with Sparky and "Time to Next Break" */}
              <div className="flex items-center justify-between mb-4">
                {/* Spacer for Sparky (50px width) */}
                <div style={{ width: '50px' }}></div>
                
                {/* "Next Break In —" centered between Sparky and right margin */}
                <div className="font-kalam text-xl font-bold" style={{ color: '#228B22' }}>
                  Next Break In —
                </div>
                
                {/* Right spacer to balance */}
                <div style={{ width: '50px' }}></div>
              </div>
              
              {/* Countdown Timer */}
              <div className="font-kalam text-4xl font-bold mb-6 text-center" style={{ color: '#228B22' }}>
                {minutesLeft} Minutes
              </div>
              
              {/* New break message */}
              <div className="text-center">
                <p className="font-kalam text-base leading-tight mb-3" style={{ color: '#228B22' }}>
                  Grandpa John asked me to be the Official Break Timer to help you keep track of your time on our website. He's learned that taking little breaks helps your eyes stay happy and your brain stay focused. It's a smart habit for everyone, no matter your age!
                </p>
                <p className="font-kalam text-base leading-tight" style={{ color: '#228B22' }}>
                  After 1 hour I will remind you to take a short break.
                </p>
              </div>
            </div>
          </div>
          
          {/* Close button row at bottom - full width like SuperAV */}
          <div className="h-12">
            <button
              onClick={handleCloseBreakTimer}
              className="w-full h-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 hover:from-gray-300 hover:via-gray-400 hover:to-gray-500 border border-gray-400 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              {closeIconUrl ? (
                <img 
                  src={closeIconUrl} 
                  alt="Close" 
                  style={{ height: '60px', width: '100%', objectFit: 'fill' }}
                />
              ) : (
                <span className="text-gray-700 font-semibold">Close</span>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Break Reminder Dialog - same width and height as SuperAV */}
      <Dialog open={isBreakReminderOpen} onOpenChange={setIsBreakReminderOpen}>
        <DialogContent 
          className="w-[288px] h-[490px] max-w-none border-2 border-[#228B22]"
          data-testid="break-reminder"
        >
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold">
              Break Reminder
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-base">
              Break Reminder content will go here
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BreakGuide;