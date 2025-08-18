import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const BreakGuide: React.FC = () => {
  const [isBreakTimerOpen, setIsBreakTimerOpen] = useState(false);
  const [isBreakReminderOpen, setIsBreakReminderOpen] = useState(false);

  const handleBreakButtonClick = () => {
    setIsBreakTimerOpen(true);
  };

  return (
    <>
      {/* Break Button - positioned bottom-left, same level as "Top & Menu" button */}
      <button
        className="fixed bottom-20 left-4 z-50 bg-gradient-to-b from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white px-6 py-3 rounded-full border-2 border-[#228B22] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 font-semibold text-lg"
        onClick={handleBreakButtonClick}
        data-allow-superav-passthrough="true"
        data-testid="break-button"
      >
        Break Guide
      </button>

      {/* Break Timer Dialog - same width as SuperAV, half height */}
      <Dialog open={isBreakTimerOpen} onOpenChange={setIsBreakTimerOpen}>
        <DialogContent 
          className="w-[288px] h-[245px] max-w-none border-2 border-[#228B22]"
          data-testid="break-timer"
        >
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold">
              Break Timer
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-base">
              Break Timer content will go here
            </p>
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