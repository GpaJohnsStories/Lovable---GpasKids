import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCachedIcon } from '@/hooks/useCachedIcon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const STORAGE_KEY = 'web_timer_reminder_minutes';

interface TimerState {
  startTime: number;
  lastActivityTime: number;
  timeActive: number; // in minutes
  reminderMinutes: number;
  isOnBreak: boolean;
  breakEndTime: number | null;
  minutesLeft: number;
}

export const WebTimerWidget = () => {
  const [timerState, setTimerState] = useState<TimerState>({
    startTime: Date.now(),
    lastActivityTime: Date.now(),
    timeActive: 0,
    reminderMinutes: 30, // default
    isOnBreak: false,
    breakEndTime: null,
    minutesLeft: 30,
  });
  
  const [showDialog, setShowDialog] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [isDue, setIsDue] = useState(false);
  
  // Ref for scrolling to break interval controls
  const intervalControlsRef = useRef<HTMLDivElement>(null);

  // Load Sparky the Timer Dragon icon
  const { iconUrl: sparkyIcon, iconName: sparkyTooltip } = useCachedIcon('ICO-SPT.gif');

  // Initialize reminder preference and check for first-time setup
  useEffect(() => {
    const savedReminder = sessionStorage.getItem(STORAGE_KEY);
    if (savedReminder) {
      const reminderMinutes = parseInt(savedReminder);
      setTimerState(prev => ({ 
        ...prev, 
        reminderMinutes,
        minutesLeft: reminderMinutes 
      }));
    } else {
      // First time - show setup dialog
      setShowSetup(true);
    }
  }, []);

  // Test mode - click Sparky icon 3 times quickly to enable 10-second test mode
  const [clickCount, setClickCount] = useState(0);
  const [isTestMode, setIsTestMode] = useState(false);
  
  const handleSparkyClick = () => {
    setClickCount(prev => prev + 1);
    setTimeout(() => setClickCount(0), 2000); // Reset after 2 seconds
    
    if (clickCount === 2) { // Third click
      setIsTestMode(true);
      const now = Date.now();
      setTimerState(prev => ({
        ...prev,
        reminderMinutes: 0.17, // 10 seconds for testing
        minutesLeft: 0.17,
        startTime: now,
        timeActive: 0
      }));
      console.log('🐉 Test mode activated! Timer set to 10 seconds');
    }
  };

  // Update timer every 10 seconds in test mode, every minute in normal mode
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      setTimerState(prev => {
        let newState = { ...prev };
        
        if (prev.isOnBreak && prev.breakEndTime) {
          // On break - countdown to break end
          const breakMinutesLeft = Math.max(0, Math.ceil((prev.breakEndTime - now) / (1000 * 60)));
          newState.minutesLeft = breakMinutesLeft;
          
          if (breakMinutesLeft <= 0) {
            // Break ended - return to work mode
            newState.isOnBreak = false;
            newState.breakEndTime = null;
            newState.startTime = now;
            newState.timeActive = 0;
            newState.minutesLeft = prev.reminderMinutes;
          }
        } else {
          // Work mode - countdown to break time
          const activeMinutes = isTestMode 
            ? Math.floor((now - prev.startTime) / (1000 * 10)) * 0.17 // 10-second intervals in test mode
            : Math.floor((now - prev.startTime) / (1000 * 60)); // 1-minute intervals normally
          const minutesUntilBreak = Math.max(0, prev.reminderMinutes - activeMinutes);
          
          newState.timeActive = activeMinutes;
          newState.minutesLeft = minutesUntilBreak;
        }
        
        return newState;
      });
      
      setIsDue(!timerState.isOnBreak && timerState.minutesLeft <= 0);
    }, isTestMode ? 10000 : 60000); // Update every 10 seconds in test mode, every minute normally

    return () => clearInterval(interval);
  }, [timerState.startTime, timerState.reminderMinutes, timerState.isOnBreak, timerState.breakEndTime, timerState.minutesLeft, isTestMode]);

  const handleSetupChoice = (minutes: number) => {
    sessionStorage.setItem(STORAGE_KEY, minutes.toString());
    const now = Date.now();
    setTimerState(prev => ({ 
      ...prev, 
      reminderMinutes: minutes,
      minutesLeft: minutes,
      startTime: now,
      timeActive: 0
    }));
    setShowSetup(false);
  };

  const handleStartBreak = () => {
    const now = Date.now();
    setTimerState(prev => ({
      ...prev,
      isOnBreak: true,
      breakEndTime: now + (5 * 60 * 1000), // 5 minutes
      minutesLeft: 5
    }));
    setIsDue(false);
  };

  const handleEndBreak = () => {
    const now = Date.now();
    setTimerState(prev => ({
      ...prev,
      isOnBreak: false,
      breakEndTime: null,
      startTime: now,
      timeActive: 0,
      minutesLeft: prev.reminderMinutes
    }));
  };

  const handleReminderChange = (value: string) => {
    const minutes = parseInt(value);
    sessionStorage.setItem(STORAGE_KEY, minutes.toString());
    const now = Date.now();
    setTimerState(prev => ({
      ...prev,
      reminderMinutes: minutes,
      minutesLeft: minutes,
      startTime: now,
      timeActive: 0
    }));
  };

  const handleChangeBreakTime = () => {
    // Scroll to and highlight the interval controls
    intervalControlsRef.current?.scrollIntoView({ behavior: 'smooth' });
    intervalControlsRef.current?.classList.add('animate-pulse');
    setTimeout(() => {
      intervalControlsRef.current?.classList.remove('animate-pulse');
    }, 2000);
  };

  const formatTime = (minutes: number) => {
    if (isTestMode && minutes < 1) {
      return `${Math.round(minutes * 60)}s`; // Show seconds in test mode
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <TooltipProvider>
      {/* Floating Widget */}
      <div className="fixed bottom-20 left-4 z-40">
        <Button
          onClick={() => {
            console.log('🕒 WebTimer button clicked, showDialog:', showDialog);
            setShowDialog(true);
          }}
          data-allow-superav-passthrough="true"
          size="sm"
          className={`
            rounded-lg shadow-lg transition-all duration-300 hover:scale-105 px-3 py-2
            ${timerState.isOnBreak
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white border-2 border-emerald-600 hover:border-emerald-500' 
              : isDue 
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
        <DialogContent className="w-[320px] max-w-[320px] p-0 border-4 border-emerald-600 bg-emerald-50 rounded-2xl shadow-xl [&>button]:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Break Timer</DialogTitle>
            <DialogDescription>Web timer to remind you to take breaks while working</DialogDescription>
          </DialogHeader>
          {/* Device Header */}
          <div className="bg-emerald-700 text-white px-3 rounded-t-xl h-[55px] flex items-center justify-between">
            {/* Sparky the Dragon - Official Timer Mascot */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="w-[55px] h-[55px] flex items-center justify-center cursor-pointer"
                  onClick={handleSparkyClick}
                >
                  {sparkyIcon ? (
                    <img 
                      src={sparkyIcon} 
                      alt="Sparky the Timer Dragon" 
                      className="w-[55px] h-[55px] object-contain cursor-help"
                    />
                  ) : (
                    <span className="text-4xl cursor-help">🐉</span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-emerald-800 text-white border-emerald-600">
                <p className="font-body">
                  {sparkyTooltip || "Sparky the Timer Dragon"}
                  {isTestMode && <span className="block text-yellow-300">TEST MODE: 10 seconds</span>}
                  {!isTestMode && <span className="block text-xs text-emerald-200">Triple-click for test mode</span>}
                </p>
              </TooltipContent>
            </Tooltip>
            
            <div className="text-center font-bold font-title text-lg flex-1">
              🕒 Break Timer {isTestMode && <span className="text-yellow-300 text-sm">(TEST)</span>}
            </div>
            
            {/* Balance spacing */}
            <div className="w-[55px]"></div>
          </div>
          
          {/* Digital Screen */}
          <div className="bg-emerald-100 text-emerald-800 mx-4 my-3 p-4 rounded-lg border-2 border-emerald-600 shadow-inner font-mono">
            <div className="text-center">
              <div className="text-3xl font-bold tracking-wider">
                {formatTime(timerState.minutesLeft)}
              </div>
              <div className="text-sm mt-1 text-emerald-600">
                {timerState.isOnBreak ? "Break ends in" : "Until break"}
              </div>
            </div>
          </div>

          {/* Break suggestions when due */}
          {isDue && !timerState.isOnBreak && (
            <div className="mx-4 mb-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3">
              <div className="text-sm font-bold text-yellow-800 text-center mb-2">
                💡 Break Ideas:
              </div>
              <div className="text-xs text-yellow-700 space-y-1">
                <div>• Get a drink 🥤</div>
                <div>• Stretch your body 🤸</div>
                <div>• Say hi to someone 👋</div>
                <div>• Go outside for fresh air 🌿</div>
              </div>
            </div>
          )}

          {/* Suggested Break Ideas when on break */}
          {timerState.isOnBreak && (
            <div className="mx-4 mb-3 bg-gradient-to-br from-red-600 to-red-700 border-2 border-red-800 rounded-lg p-4 shadow-lg">
              <div className="text-lg font-bold text-white text-center mb-3 font-title">
                🔥 Suggested Break Ideas:
              </div>
              <div className="text-sm text-red-100 space-y-2 font-body">
                <div className="flex items-center">• Get a drink</div>
                <div className="flex items-center">• Stretch your arms & legs</div>
                <div className="flex items-center">• Say hi to someone</div>
                <div className="flex items-center">• Go outside for fresh air</div>
                <div className="mt-3 p-2 bg-red-800/50 rounded-lg border border-red-500 animate-pulse">
                  <div className="text-yellow-300 font-bold text-center">
                    • DO NOT USE another screen
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reminder interval controls */}
          <div ref={intervalControlsRef} className="mx-4 mb-4">
            <Label className="text-sm font-semibold text-emerald-800 block mb-2">
              Break Interval:
            </Label>
            <RadioGroup 
              value={timerState.reminderMinutes.toString()} 
              onValueChange={handleReminderChange}
              className="flex justify-center items-center gap-4"
            >
              {[30, 60, 90].map((minutes) => (
                <div key={minutes} className="flex items-center space-x-1">
                  <RadioGroupItem 
                    value={minutes.toString()} 
                    id={`interval-${minutes}`}
                    className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                  />
                  <Label 
                    htmlFor={`interval-${minutes}`} 
                    className="text-xs font-medium text-emerald-800 cursor-pointer"
                  >
                    {minutes}m
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Action buttons */}
          <div className="mx-4 mb-4 space-y-2">
            {timerState.isOnBreak ? (
              <div className="space-y-2">
                <Button 
                  onClick={handleEndBreak}
                  className="w-full bg-gradient-to-br from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full shadow-lg border-2 border-emerald-900 font-semibold transition-all hover:shadow-xl active:transform active:scale-95 font-body"
                >
                  I took a break
                </Button>
                <Button 
                  onClick={handleChangeBreakTime}
                  variant="outline"
                  className="w-full bg-gradient-to-br from-emerald-200 to-emerald-300 hover:from-emerald-300 hover:to-emerald-400 text-emerald-800 border-2 border-emerald-500 rounded-full shadow-lg font-semibold transition-all hover:shadow-xl active:transform active:scale-95 font-body"
                >
                  Change break time
                </Button>
              </div>
            ) : isDue ? (
              <Button 
                onClick={handleStartBreak}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg border-2 border-emerald-800 font-semibold transition-all hover:shadow-xl active:transform active:scale-95"
              >
                Start 5 Min Break
              </Button>
            ) : (
              <Button 
                onClick={() => setShowDialog(false)}
                variant="outline"
                className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-400 rounded-full shadow-lg font-semibold transition-all hover:shadow-xl active:transform active:scale-95"
              >
                Close
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Setup Dialog */}
      <Dialog open={showSetup} onOpenChange={() => {}}>
        <DialogContent className="w-[320px] max-w-[320px] p-0 border-4 border-emerald-600 bg-emerald-50 rounded-2xl shadow-xl [&>button]:hidden" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="sr-only">
            <DialogTitle>Timer Setup</DialogTitle>
            <DialogDescription>Choose how often you want to be reminded to take breaks</DialogDescription>
          </DialogHeader>
          {/* Device Header */}
          <div className="bg-emerald-700 text-white p-3 rounded-t-xl">
            <div className="text-center font-bold font-title text-lg">
              🕒 Timer Setup
            </div>
          </div>
          
          <div className="p-4">
            <p className="text-sm text-emerald-800 text-center mb-4 font-body">
              How often would you like to be reminded to take a break?
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => handleSetupChoice(30)} 
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg border-2 border-emerald-800 font-semibold transition-all hover:shadow-xl active:transform active:scale-95"
              >
                Every 30 minutes
              </Button>
              
              <Button 
                onClick={() => handleSetupChoice(60)} 
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg border-2 border-emerald-800 font-semibold transition-all hover:shadow-xl active:transform active:scale-95"
              >
                Every 60 minutes
              </Button>
              
              <Button 
                onClick={() => handleSetupChoice(90)} 
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg border-2 border-emerald-800 font-semibold transition-all hover:shadow-xl active:transform active:scale-95"
              >
                Every 90 minutes
              </Button>
            </div>
            
            <p className="text-xs text-emerald-600 text-center mt-4 font-body">
              This setting will be remembered until you close your browser.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default WebTimerWidget;