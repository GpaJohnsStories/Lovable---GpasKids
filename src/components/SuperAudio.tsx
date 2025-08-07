import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Play, Pause, RotateCcw, Square } from 'lucide-react';

interface SuperAudioProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  title: string;
  author?: string;
  voiceName?: string;
  showAuthor?: boolean;
}

export const SuperAudio: React.FC<SuperAudioProps> = ({
  isOpen,
  onClose,
  content,
  title,
  author,
  voiceName,
  showAuthor = true
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        ref={dialogRef}
        className="fixed max-w-none max-h-none p-0 bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-orange-300 rounded-2xl shadow-2xl cursor-grab active:cursor-grabbing"
        style={{
          width: '288px',
          height: '330px',
          left: `calc(10% + ${position.x}px)`,
          top: `calc(5% + ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Close button - Top Right Corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>

        {/* Content Area - Full popup */}
        <div className="h-full p-1">
          <div className="h-[98%] w-[98%] mx-auto bg-white/50 rounded-xl p-4 backdrop-blur-sm border border-orange-200">
            {/* Title and Author at top - 40% */}
            <div className="text-center h-[40%] pt-2">
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>
              {showAuthor && author && (
                <p className="text-sm text-gray-600 mt-1">by {author}</p>
              )}
              {voiceName && (
                <p className="text-xs text-gray-500 mt-1"><br />Being read by {voiceName} from OpenAI</p>
              )}
            </div>
            
            {/* 4x4 Button Grid - Bottom 60% */}
            <div className="h-[60%]">
              <div className="grid grid-cols-4 max-w-[220px] mx-auto h-full" style={{ gridTemplateRows: '1fr 0.35fr 0.5fr 1fr' }}>
                {/* Row 1: Main Audio Controls */}
                <button 
                  className="w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
                    transform hover:scale-105 hover:shadow-xl active:scale-95
                    transition-all duration-200 flex items-center justify-center
                    relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, #16a34a 0%, #15803d 100%)`,
                    boxShadow: `0 8px 20px rgba(22, 163, 74, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
                  }}
                  onClick={(e) => {e.stopPropagation(); console.log('Play clicked');}}
                >
                  <Play className="w-6 h-6 text-white drop-shadow-sm" fill="white" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                </button>

                <button 
                  className="w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
                    transform hover:scale-105 hover:shadow-xl active:scale-95
                    transition-all duration-200 flex items-center justify-center
                    relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, #F2BA15 0%, #d39e00 100%)`,
                    boxShadow: `0 8px 20px rgba(242, 186, 21, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
                  }}
                  onClick={(e) => {e.stopPropagation(); console.log('Pause clicked');}}
                >
                  <Pause className="w-6 h-6 text-white drop-shadow-sm" fill="white" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                </button>

                <button 
                  className="w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
                    transform hover:scale-105 hover:shadow-xl active:scale-95
                    transition-all duration-200 flex items-center justify-center
                    relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, #169CF9 0%, #0284c7 100%)`,
                    boxShadow: `0 8px 20px rgba(22, 156, 249, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
                  }}
                  onClick={(e) => {e.stopPropagation(); console.log('Restart clicked');}}
                >
                  <RotateCcw className="w-6 h-6 text-white drop-shadow-sm" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                </button>

                <button 
                  className="w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
                    transform hover:scale-105 hover:shadow-xl active:scale-95
                    transition-all duration-200 flex items-center justify-center
                    relative overflow-hidden group"
                  style={{
                    background: `linear-gradient(135deg, #DC2626 0%, #b91c1c 100%)`,
                    boxShadow: `0 8px 20px rgba(220, 38, 38, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
                  }}
                  onClick={(e) => {e.stopPropagation(); console.log('Stop clicked');}}
                >
                  <Square className="w-5 h-5 text-white drop-shadow-sm" fill="white" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                </button>

                {/* Row 2: Progress bar spanning all 4 columns */}
                <div className="col-span-4 bg-white/20 border-2 border-white/40 rounded-lg shadow-lg flex items-center justify-center p-1">
                  <div className="w-full max-w-[180px] relative">
                    {/* Progress track */}
                    <div className="w-full h-2 bg-gray-300/50 rounded-full relative overflow-hidden">
                      {/* Progress fill */}
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
                        style={{ width: '35%' }}
                      ></div>
                      {/* Progress handle */}
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 border-2 border-blue-500 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
                        style={{ 
                          left: 'calc(35% - 8px)',
                          background: '#F2BA15'
                        }}
                      ></div>
                    </div>
                    {/* Time labels */}
                    <div className="flex justify-between mt-1 text-xs text-gray-600">
                      <span>2:15</span>
                      <span>6:42</span>
                    </div>
                  </div>
                </div>

                {/* Row 3: Speed Controls Header */}
                <div 
                  className="col-span-4 border-2 border-white/40 rounded-lg shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: '#814d2e' }}
                >
                  <span className="text-white text-sm font-medium">Speed Controls</span>
                </div>

                {/* Row 4: Speed Controls */}
                <div className="flex items-center justify-center" style={{ backgroundColor: '#814d2e' }}>
                  <button 
                    className="w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
                      transform hover:scale-105 hover:shadow-xl active:scale-95
                      transition-all duration-200 flex flex-col items-center justify-center
                      relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, hsl(120, 50%, 60%) 0%, hsl(120, 50%, 50%) 100%)`,
                      boxShadow: `0 8px 20px rgba(34, 139, 34, 0.3), inset 0 2px 4px rgba(255,255,255,0.3)`
                    }}
                    onClick={(e) => {e.stopPropagation(); console.log('Normal speed clicked');}}
                  >
                    <span className="text-white font-bold text-xs drop-shadow-sm">Normal</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                  </button>
                </div>

                <div className="flex items-center justify-center" style={{ backgroundColor: '#814d2e' }}>
                  <button 
                    className="w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
                      transform hover:scale-105 hover:shadow-xl active:scale-95
                      transition-all duration-200 flex flex-col items-center justify-center
                      relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, hsl(120, 50%, 55%) 0%, hsl(120, 50%, 45%) 100%)`,
                      boxShadow: `0 8px 20px rgba(34, 139, 34, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
                    }}
                    onClick={(e) => {e.stopPropagation(); console.log('Fast speed clicked');}}
                  >
                    <span className="text-white font-bold text-xs drop-shadow-sm">Fast</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                  </button>
                </div>

                <div className="flex items-center justify-center" style={{ backgroundColor: '#814d2e' }}>
                  <button 
                    className="w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
                      transform hover:scale-105 hover:shadow-xl active:scale-95
                      transition-all duration-200 flex flex-col items-center justify-center
                      relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, hsl(120, 55%, 45%) 0%, hsl(120, 55%, 35%) 100%)`,
                      boxShadow: `0 8px 20px rgba(34, 139, 34, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)`
                    }}
                    onClick={(e) => {e.stopPropagation(); console.log('Faster speed clicked');}}
                  >
                    <span className="text-white font-bold text-xs drop-shadow-sm">Faster</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                  </button>
                </div>

                <div className="flex items-center justify-center" style={{ backgroundColor: '#814d2e' }}>
                  <button 
                    className="w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
                      transform hover:scale-105 hover:shadow-xl active:scale-95
                      transition-all duration-200 flex flex-col items-center justify-center
                      relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, #228B22 0%, #1e7a1e 100%)`,
                      boxShadow: `0 8px 20px rgba(34, 139, 34, 0.6), inset 0 2px 4px rgba(255,255,255,0.3)`
                    }}
                    onClick={(e) => {e.stopPropagation(); console.log('Fastest speed clicked');}}
                  >
                    <span className="text-white font-bold text-xs drop-shadow-sm">Fastest</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};