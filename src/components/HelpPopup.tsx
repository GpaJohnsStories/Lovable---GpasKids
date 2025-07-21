
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { HelpCircle, X } from "lucide-react";
import IsolatedStoryRenderer from "@/components/story/IsolatedStoryRenderer";
import { StoryCodeAudioControls } from "@/components/story-content/StoryCodeAudioControls";
import buddyPhoto from "@/assets/buddy-original.png";

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
        className="max-w-2xl max-h-[95vh] bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-orange-200 flex flex-col"
        style={{ fontFamily: "'Kalam', 'Caveat', cursive, sans-serif" }}
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-orange-200">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-orange-300">
              <AvatarImage src={buddyPhoto} alt="Buddy the Helper" />
              <AvatarFallback className="bg-orange-100 text-orange-700">🐱</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-orange-600" />
              <DialogTitle className="text-xl font-bold text-orange-800">
                Help: {getPageTitle(currentRoute)}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Audio Controls */}
        {storyData && (
          <div className="py-2">
            <StoryCodeAudioControls
              audioUrl={storyData.audio_url}
              title={storyData.title || `Help for ${getPageTitle(currentRoute)}`}
              content={helpContent}
              author={storyData.author || 'Buddy the Helper'}
              description={storyData.description}
              aiVoiceName={storyData.ai_voice_name}
            />
          </div>
        )}

        <div className="py-4 flex-1 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <span className="ml-3 text-orange-700">Loading help content...</span>
            </div>
          ) : (
            <ScrollArea className="max-h-[75vh] w-full rounded-md border border-orange-200 bg-white/50 p-4">
              <IsolatedStoryRenderer 
                content={helpContent}
                useRichCleaning={true}
                category="WebText"
                className="text-gray-800 leading-relaxed"
              />
            </ScrollArea>
          )}
        </div>

        <div className="flex justify-end items-center pt-4 border-t border-orange-200">
          <Button
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Close Help
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default HelpPopup;
