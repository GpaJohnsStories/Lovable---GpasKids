
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import StoryContentRenderer from "@/components/content/StoryContentRenderer";

interface HelpPopupProps {
  isOpen: boolean;
  onClose: () => void;
  helpContent: string;
  isLoading: boolean;
  currentRoute: string;
  storyData?: any;
}

const HelpPopup: React.FC<HelpPopupProps> = ({
  isOpen,
  onClose,
  helpContent,
  isLoading,
  currentRoute,
  storyData
}) => {
  console.log('🔍 HelpPopup render - isOpen:', isOpen, 'currentRoute:', currentRoute);
  
  const getPageTitle = (route: string): string => {
    if (route.startsWith('/story/')) return 'Story Page';
    if (route.startsWith('/author/')) return 'Author Bio';
    if (route.startsWith('/comment/')) return 'Comment Details';
    if (route.startsWith('/buddys_admin')) return 'Admin Dashboard';
    
    const titles: Record<string, string> = {
      '/': 'Home Page',
      '/library': 'Library',
      '/about': 'About Page',
      '/make-comment': 'Make Comment',
      '/view-comments': 'View Comments',
      '/writing': 'Story Writing',
      '/privacy': 'Privacy Policy',
      '/help-gpa': 'Help Grandpa',
      '/admin': 'Admin Panel',
      '/simple-admin': 'Simple Admin',
      '/admin-access': 'Admin Access'
    };
    
    return titles[route] || 'Help';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl h-[90vh] bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-orange-200 flex flex-col p-0 [&>button]:hidden"
        style={{ fontFamily: "'Kalam', 'Caveat', cursive, sans-serif" }}
      >
        {/* Header with Title and Close Button */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 pb-2 border-b border-orange-200 space-y-0">
          <div className="flex items-center gap-3">
            {/* Buddy's Green Box - Matching header styling */}
            <div className="group relative z-10 bg-gradient-to-br from-green-600/80 to-green-700/60 hover:from-red-600/80 hover:to-red-700/60 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center text-center w-20 h-28 shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] border-2 border-green-600 hover:border-red-600 transform hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95">
              <img 
                src="/lovable-uploads/949dcec1-2a5d-481c-9ce6-aa0da5edb3d0.png"
                alt="Buddy the Helper Dog"
                className="w-full h-12 object-cover rounded-md mb-1"
              />
              <div className="text-yellow-200 group-hover:text-[#FFFF00] text-[8px] font-bold leading-tight transition-colors duration-200">
                <div className="group-hover:hidden">Your Helper</div>
                <div className="group-hover:hidden">Buddy!</div>
                <div className="hidden group-hover:block">I'm Here</div>
                <div className="hidden group-hover:block">to Help!</div>
              </div>
            </div>
            <DialogTitle className="text-lg font-bold text-orange-800">
              {storyData?.title || `Help: ${getPageTitle(currentRoute)}`}
            </DialogTitle>
          </div>
          
          {/* Close Button - Top Right */}
          <Button
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shrink-0"
            size="sm"
          >
            <X className="h-4 w-4 mr-1 stroke-2" />
            Close
          </Button>
        </DialogHeader>

        {/* Audio Controls - Below Title */}
        {storyData && (
          <div className="px-4 pb-2">
            <div className="flex items-center justify-center gap-2 p-2 bg-white/80 rounded-lg border border-blue-200">
              <button
                className="text-white text-xs px-3 py-1.5 rounded-md font-bold shadow-[0_3px_0_#22c55e,0_4px_8px_rgba(0,0,0,0.2)] border border-green-700 transition-all duration-200 flex items-center gap-1.5 bg-gradient-to-b from-green-400 via-green-500 to-green-600 hover:shadow-[0_2px_0_#22c55e,0_3px_6px_rgba(0,0,0,0.3)] hover:translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#22c55e,0_2px_4px_rgba(0,0,0,0.2)]"
                title="Start reading the story"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Read to Me
              </button>
              
              <button
                className="text-white text-xs px-2 py-1.5 rounded-md font-bold shadow-[0_3px_0_#f59e0b,0_4px_8px_rgba(0,0,0,0.2)] border border-amber-700 transition-all duration-200 flex items-center gap-1 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:shadow-[0_2px_0_#f59e0b,0_3px_6px_rgba(0,0,0,0.3)] hover:translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#f59e0b,0_2px_4px_rgba(0,0,0,0.2)]"
                title="Pause audio playback"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
                Pause
              </button>

              <button
                className="text-white text-xs px-2 py-1.5 rounded-md font-bold shadow-[0_3px_0_#ef4444,0_4px_8px_rgba(0,0,0,0.2)] border border-red-700 transition-all duration-200 flex items-center gap-1 bg-gradient-to-b from-red-400 via-red-500 to-red-600 hover:shadow-[0_2px_0_#ef4444,0_3px_6px_rgba(0,0,0,0.3)] hover:translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#ef4444,0_2px_4px_rgba(0,0,0,0.2)]"
                title="Stop and reset audio"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12"/>
                </svg>
                Stop
              </button>
            </div>
          </div>
        )}

        {/* Content Area - Expands to fill remaining space */}
        <div className="flex-1 min-h-0 px-4 pb-4 pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <span className="ml-3 text-orange-700">Loading help content...</span>
            </div>
          ) : (
            <ScrollArea className="h-full w-full rounded-md border border-orange-200 bg-white/50 p-4">
              <div className="prose prose-orange max-w-none">
                <StoryContentRenderer 
                  content={helpContent}
                  className="text-gray-800 leading-relaxed"
                />
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpPopup;
