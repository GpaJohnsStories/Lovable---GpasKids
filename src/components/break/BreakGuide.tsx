import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCachedIcon } from '@/hooks/useCachedIcon';

const BreakGuide: React.FC = () => {
  const [isBreakTimerOpen, setIsBreakTimerOpen] = useState(false);
  const [isBreakReminderOpen, setIsBreakReminderOpen] = useState(false);
  
  // Get close icon for the Break Timer
  const { iconUrl: closeIconUrl } = useCachedIcon('!CO-CLS.jpg');

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
          className="w-[288px] h-[490px] max-w-none border-2 border-[#228B22] bg-green-100 p-0 gap-0 [&>button]:hidden"
          data-testid="break-timer"
        >
          {/* Screen panel that almost fills the dialog */}
          <div className="flex-1 m-2 mb-2 bg-white rounded border border-gray-300 relative overflow-hidden">
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
            <div className="relative z-10 h-full flex items-center justify-center p-4">
              <p className="text-center text-base text-gray-800">
                Break Timer content will go here
              </p>
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