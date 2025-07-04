import { useActivityTracker } from '@/hooks/useActivityTracker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, Coffee } from 'lucide-react';

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

  return (
    <Card className="fixed bottom-4 right-4 p-4 bg-white/90 backdrop-blur-sm border shadow-lg z-50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">
            Active: {formatTime(timeActive)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div 
            className={`w-2 h-2 rounded-full ${
              isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}
          />
          <span className="text-xs text-gray-500">
            {isActive ? 'Active' : 'Idle'}
          </span>
        </div>

        {timeActive >= 60 && (
          <Button
            size="sm"
            variant="outline"
            onClick={resetActivityTimer}
            className="text-xs"
          >
            <Coffee className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ActivityTracker;