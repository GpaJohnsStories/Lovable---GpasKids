import { useState } from 'react';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ActivityTrackerDemo = () => {
  const { isActive, timeActive, resetActivityTimer } = useActivityTracker();
  const [isVisible, setIsVisible] = useState(false);

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
      {/* Toggle button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 left-4 z-50 bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
        size="sm"
      >
        Activity Tracker
      </Button>

      {/* Activity tracker card */}
      {isVisible && (
        <Card className="fixed bottom-16 left-4 p-4 bg-white/95 backdrop-blur-sm border shadow-lg z-50 animate-fade-in">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Activity Tracker</h3>
              <div 
                className={`w-3 h-3 rounded-full ${
                  isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}
                title={isActive ? 'Active' : 'Idle'}
              />
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span>Time Active: <strong>{formatTime(timeActive)}</strong></span>
              </div>
              
              <div className="text-xs text-gray-500">
                Status: {isActive ? '🟢 Active' : '🔴 Idle (5+ min = break detected)'}
              </div>
              
              <div className="text-xs text-gray-500">
                Break suggestion: {timeActive >= 60 ? '⚠️ Due' : `After ${60 - timeActive} more minutes`}
              </div>
            </div>

            {timeActive >= 60 && (
              <Button
                size="sm"
                variant="outline"
                onClick={resetActivityTimer}
                className="w-full text-xs"
              >
                Simulate Break Taken
              </Button>
            )}

            <div className="text-[10px] text-gray-400 border-t pt-2">
              <p>• Break suggestion at 1 hour</p>
              <p>• Repeats every 15 minutes if ignored</p>
              <p>• Resets after 5-minute break</p>
              <p>• Uses localStorage (no cookies)</p>
            </div>

            <div className="text-xs text-black text-center mt-2 italic">
              Click Activity Tracker to Hide This Message.
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ActivityTrackerDemo;