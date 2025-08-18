import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const STORAGE_KEY = 'web_timer_reminder_minutes';

interface TimerState {
  startTime: number;
  lastActivityTime: number;
  timeActive: number; // in minutes
  reminderMinutes: number;
}

export const WebTimerWidget = () => {
  const [timerState, setTimerState] = useState<TimerState>({
    startTime: Date.now(),
    lastActivityTime: Date.now(),
    timeActive: 0,
    reminderMinutes: 30, // default
  });
  
  const [showDialog, setShowDialog] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [isDue, setIsDue] = useState(false);

  // Initialize reminder preference and check for first-time setup
  useEffect(() => {
    const savedReminder = sessionStorage.getItem(STORAGE_KEY);
    if (savedReminder) {
      setTimerState(prev => ({ ...prev, reminderMinutes: parseInt(savedReminder) }));
    } else {
      // First time - show setup dialog
      setShowSetup(true);
    }
  }, []);

  // Update timer every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const activeMinutes = Math.floor((now - timerState.startTime) / (1000 * 60));
      
      setTimerState(prev => ({ ...prev, timeActive: activeMinutes }));
      setIsDue(activeMinutes >= timerState.reminderMinutes);
    }, 30000);

    return () => clearInterval(interval);
  }, [timerState.startTime, timerState.reminderMinutes]);

  const handleSetupChoice = (minutes: number) => {
    sessionStorage.setItem(STORAGE_KEY, minutes.toString());
    setTimerState(prev => ({ ...prev, reminderMinutes: minutes }));
    setShowSetup(false);
  };

  const handleReset = () => {
    const now = Date.now();
    setTimerState(prev => ({
      ...prev,
      startTime: now,
      lastActivityTime: now,
      timeActive: 0,
    }));
    setIsDue(false);
    setShowDialog(false);
  };

  const handleChangeReminder = () => {
    setShowDialog(false);
    setShowSetup(true);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <>
      {/* Floating Widget */}
      <div className="fixed bottom-20 left-4 z-40">
        <Button
          onClick={() => setShowDialog(true)}
          data-allow-superav-passthrough="true"
          size="sm"
          className={`
            rounded-lg shadow-lg transition-all duration-300 hover:scale-105 px-3 py-2
            ${isDue 
              ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white border-2 border-red-600 hover:border-red-500 animate-pulse' 
              : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white border-2 border-blue-600 hover:border-blue-500'
            }
          `}
          aria-live="polite"
          aria-label={isDue ? "Time to take a break" : "Web Timer"}
        >
          <Clock className="h-4 w-4 mr-2" />
          <span className="font-bold font-fun">
            {isDue ? "Time to take a break" : "Web Timer"}
          </span>
        </Button>
      </div>

      {/* Main Timer Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-title">Web Timer</DialogTitle>
            <DialogDescription className="font-body">
              Track your screen time and take healthy breaks.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold font-title text-primary">
                {formatTime(timerState.timeActive)}
              </p>
              <p className="text-sm text-muted-foreground font-body">
                Active time this session
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-body">
                Reminder set for every <strong>{timerState.reminderMinutes} minutes</strong>
              </p>
            </div>

            {isDue && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-red-700 font-bold font-body">
                  🌟 Time for a break! 🌟
                </p>
                <p className="text-red-600 text-sm font-body">
                  Step away from the screen and stretch!
                </p>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleReset} 
                className="w-full font-body"
                variant={isDue ? "default" : "outline"}
              >
                I took a break - Reset Timer
              </Button>
              
              <Button 
                onClick={handleChangeReminder} 
                variant="outline" 
                className="w-full font-body"
              >
                Change Reminder Time
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Setup Dialog */}
      <Dialog open={showSetup} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="font-title">Web Timer Setup</DialogTitle>
            <DialogDescription className="font-body">
              How often would you like to be reminded to take a break?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            <Button 
              onClick={() => handleSetupChoice(30)} 
              variant="outline" 
              className="w-full h-12 font-body text-lg"
            >
              Every 30 minutes
            </Button>
            
            <Button 
              onClick={() => handleSetupChoice(60)} 
              variant="outline" 
              className="w-full h-12 font-body text-lg"
            >
              Every 60 minutes
            </Button>
            
            <Button 
              onClick={() => handleSetupChoice(90)} 
              variant="outline" 
              className="w-full h-12 font-body text-lg"
            >
              Every 90 minutes
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center font-body">
            This setting will be remembered until you close your browser.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WebTimerWidget;