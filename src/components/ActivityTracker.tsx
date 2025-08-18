
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { Button } from '@/components/ui/button';
import { Clock, Coffee, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BreakTimerPopup } from './BreakTimerPopup';
import { useState, useEffect } from 'react';

interface ActivityTrackerProps {
  showDebugInfo?: boolean;
}

const ActivityTracker = ({ showDebugInfo = false }: ActivityTrackerProps) => {
  const { isActive, timeActive, resetActivityTimer } = useActivityTracker();
  const [isBreakTimerOpen, setIsBreakTimerOpen] = useState(false);

  // Listen for break timer events
  useEffect(() => {
    const handleShowBreakTimer = () => {
      setIsBreakTimerOpen(true);
    };

    window.addEventListener('showBreakTimer', handleShowBreakTimer);
    return () => window.removeEventListener('showBreakTimer', handleShowBreakTimer);
  }, []);

  if (!showDebugInfo) {
    return (
      <BreakTimerPopup
        isOpen={isBreakTimerOpen}
        onClose={() => setIsBreakTimerOpen(false)}
        onBreakComplete={resetActivityTimer}
      />
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Simple attractive button version - no time showing until clicked
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full shadow-lg bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 hover:from-purple-500 hover:via-purple-600 hover:to-purple-700 border-2 border-green-800 hover:border-green-700 transition-all duration-200 hover:scale-105 text-white px-4 py-2"
          >
            <Clock className="h-4 w-4 mr-2" />
            <span className="font-semibold">Activity</span>
            <div 
              className={`w-2 h-2 rounded-full ml-2 ${
                isActive ? 'bg-green-300 animate-pulse' : 'bg-gray-300'
              }`}
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Activity Timer
            </DialogTitle>
            <DialogDescription>
              This timer keeps track of your internet time on this site and suggests breaks to protect your eyes and wellbeing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-800">Current Status:</span>
                <span className={`text-sm font-semibold ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {isActive ? 'Active' : 'Idle'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-orange-800">Time Active:</span>
                <span className="text-sm font-semibold text-orange-900">{formatTime(timeActive)}</span>
              </div>
            </div>
            
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="mb-1"><strong>What it does:</strong> Automatically tracks when you're actively reading and reminds you to take breaks every 30 minutes.</p>
                <p><strong>Why it helps:</strong> Regular breaks reduce eye strain and improve focus which is important for everyone.</p>
              </div>
            </div>

            {timeActive > 0 && (
              <Button
                onClick={resetActivityTimer}
                variant="outline"
                className="w-full"
              >
                <Coffee className="h-4 w-4 mr-2" />
                I took a break - Reset Timer
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <BreakTimerPopup
        isOpen={isBreakTimerOpen}
        onClose={() => setIsBreakTimerOpen(false)}
        onBreakComplete={resetActivityTimer}
      />
    </div>
  );
};

export default ActivityTracker;
