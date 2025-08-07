import React from 'react';
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-[5%] left-[10%] w-[80vw] h-[90vh] max-w-none max-h-none p-0 bg-gradient-to-b from-amber-50 to-orange-100 border-4 border-orange-300 rounded-2xl shadow-2xl">
        {/* Header */}
        <DialogHeader className="relative p-6 pb-4 bg-gradient-to-r from-orange-400 to-amber-400 rounded-t-xl">
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

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="h-full bg-white/50 rounded-xl p-6 backdrop-blur-sm border border-orange-200">
            <div 
              className="font-handwritten text-lg leading-relaxed text-blue-800 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:mb-4 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:list-inside [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:list-inside [&>ol]:mb-3 [&>li]:mb-1"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};