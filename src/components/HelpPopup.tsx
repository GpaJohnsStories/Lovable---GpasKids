
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
import { UniversalAudioControls } from "@/components/UniversalAudioControls";
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
            {/* Buddy's Photo */}
            <img 
              src="/lovable-uploads/949dcec1-2a5d-481c-9ce6-aa0da5edb3d0.png"
              alt="Buddy the Helper Dog"
              className="w-16 h-16 object-cover rounded-lg border-2 border-green-600 shadow-lg"
            />
            <DialogTitle className="text-2xl font-bold text-orange-800">
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

        {/* Audio Controls - Aligned to the right */}
        <div className="px-4 pb-0 flex justify-end">
          <div className="w-fit">
            <UniversalAudioControls 
              title={storyData?.title || `Help: ${getPageTitle(currentRoute)}`}
              content={helpContent}
              allowTextToSpeech={true}
              context="help-popup"
              size="sm"
              className="!bg-white/80 !justify-start"
            />
          </div>
        </div>

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
