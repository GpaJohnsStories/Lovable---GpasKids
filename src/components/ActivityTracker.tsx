import { useActivityTracker } from '@/hooks/useActivityTracker';
import { Button } from '@/components/ui/button';
import { Clock, Coffee, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ActivityTrackerProps {
  showDebugInfo?: boolean;
}

const ActivityTracker = ({ showDebugInfo = false }: ActivityTrackerProps) => {
  const { isActive, timeActive, resetActivityTimer } = useActivityTracker();

  if (!showDebugInfo) {
    return null; // Hidden by default, can be enabled for debugging
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
    <div className="fixed bottom-4 right-4 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full shadow-lg bg-white/90 hover:bg-white border-2 border-orange-200 hover:border-orange-300 transition-all duration-200 hover:scale-105"
          >
            <Clock className="h-4 w-4 mr-2 text-orange-600" />
            <span className="text-orange-700 font-medium">Activity</span>
            <div 
              className={`w-2 h-2 rounded-full ml-2 ${
                isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
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
              This timer helps track your reading time and suggests healthy breaks to protect your eyes and wellbeing.
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
                <p><strong>Why it helps:</strong> Regular breaks reduce eye strain and improve focus, especially important for children's health.</p>
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
    </div>
  );
};

export default ActivityTracker;