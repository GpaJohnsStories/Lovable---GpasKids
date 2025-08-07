import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface SuperAudioProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  title: string;
}

export const SuperAudio: React.FC<SuperAudioProps> = ({
  isOpen,
  onClose,
  content,
  title
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
        className="fixed max-w-none max-h-none p-0 bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-orange-300 rounded-2xl shadow-2xl"
        style={{
          width: '288px',
          height: '330px',
          left: `calc(10% + ${position.x}px)`,
          top: `calc(5% + ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
      >
        {/* Header - Draggable */}
        <DialogHeader 
          className="relative p-6 pb-4 bg-gradient-to-r from-orange-400 to-amber-400 rounded-t-xl cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <DialogTitle className="text-2xl font-bold text-white text-center pr-10">
            {title}
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </DialogHeader>

        {/* Empty Content Area - Ready for future features */}
        <div className="flex-1 p-6">
          <div className="h-full bg-white/50 rounded-xl p-6 backdrop-blur-sm border border-orange-200">
            {/* Content will go here when ready */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};