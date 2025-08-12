
import React, { useState, useEffect } from 'react';
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
import { supabase } from "@/integrations/supabase/client";
import { useCachedIcon } from "@/hooks/useCachedIcon";
import { AudioButton } from "@/components/AudioButton";
import { SuperAV } from "@/components/SuperAV";
import { createSafeHtml } from "../utils/xssProtection";

interface HelpPopupProps {
  isOpen: boolean;
  onClose: () => void;
  helpContent: string;
  isLoading: boolean;
  currentRoute: string;
  storyData?: any;
  onNavigateToGuide?: () => void;
}

const HelpPopup: React.FC<HelpPopupProps> = ({
  isOpen,
  onClose,
  helpContent,
  isLoading,
  currentRoute,
  storyData,
  onNavigateToGuide
}) => {
  const [isSuperAVOpen, setIsSuperAVOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [audioCode, setAudioCode] = useState<string>('HELP');
  console.log('🔍 HelpPopup render - isOpen:', isOpen, 'currentRoute:', currentRoute);
  console.log('🎵 SuperAV state - isSuperAVOpen:', isSuperAVOpen, 'storyCode:', storyData?.story_code, 'audioCode:', audioCode);
  
  // Try to get cached icon for the story code (e.g., HLP-LIB -> HLP-LIB.jpg)
  const storyCode = storyData?.story_code;
  const { iconUrl: cachedIconUrl } = useCachedIcon(storyCode ? `${storyCode}.jpg` : null);
  
  // Update audioCode when storyData changes
  useEffect(() => {
    if (storyData?.story_code) {
      setAudioCode(storyData.story_code);
    }
  }, [storyData]);
  
  // Helper function to get icon URL from Supabase storage
  const getIconUrl = (iconName: string) => {
    return supabase.storage.from('icons').getPublicUrl(iconName).data.publicUrl;
  };

  // Safe icon URL getter with fallback
  const getSafeIconUrl = (iconCode: string) => {
    return getIconUrl(`${iconCode}.jpg`);
  };
  
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

  const handleGuideClick = () => {
    onClose();
    if (onNavigateToGuide) {
      onNavigateToGuide();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl h-[90vh] bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-orange-200 flex flex-col p-0 [&>button]:hidden"
        style={{ fontFamily: "'Kalam', 'Caveat', cursive, sans-serif" }}
      >
        {/* Header with Title and Audio Controls */}
        <DialogHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 pb-0 border-b border-orange-200 space-y-0">
          <div className="flex items-center gap-3">
            {/* Guide Photo - Now links to /guide */}
            <button onClick={handleGuideClick}>
              <img 
                src={getSafeIconUrl("ICO-GU1")}
                alt="Guide icon - Click to go to guide"
                className="w-20 h-20 object-cover rounded-lg border-2 border-green-600 shadow-lg hover:border-orange-600 hover:scale-105 transition-all duration-200 cursor-pointer"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src.endsWith('.jpg')) {
                    img.src = getIconUrl('ICO-GU1.png');
                  } else if (img.src.endsWith('.png')) {
                    img.src = getIconUrl('ICO-GU1.gif');
                  } else {
                    console.log('All fallback formats failed for ICO-GU1');
                  }
                }}
              />
            </button>
            <DialogTitle className="text-2xl font-bold text-orange-800">
              {storyData?.title || `Help: ${getPageTitle(currentRoute)}`}
            </DialogTitle>
          </div>
          
          {/* Audio Button - Top Right */}
          <div className="flex-shrink-0 mt-2 sm:mt-0">
            <AudioButton 
              code={audioCode} 
              onClick={() => {
                console.log('🎵 Audio button clicked, opening SuperAV for code:', audioCode);
                setIsSuperAVOpen(true);
              }} 
            />
          </div>
        </DialogHeader>

        {/* Content Area - Expands to fill remaining space */}
        <div className="flex-1 min-h-0 px-4 pb-4 pt-0 relative">
          
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <span className="ml-3 text-orange-700">Loading help content...</span>
            </div>
          ) : (
            <ScrollArea className="h-full w-full rounded-md border border-orange-200 bg-white/50 p-4">
              <div className="prose prose-orange max-w-none prose-headings:font-handwritten prose-p:font-handwritten prose-li:font-handwritten prose-h3:text-orange-800 prose-h3:text-xl prose-h3:font-bold prose-p:text-gray-800 prose-p:leading-relaxed prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-800 relative">
                {/* Check for photo 1 or cached icon for the upper left corner */}
                {(storyData?.photo_link_1 || cachedIconUrl) && (
                  <div className="float-left mr-4 mb-2">
                    <img
                      src={storyData?.photo_link_1 || cachedIconUrl}
                      alt={storyData?.photo_alt_1 || `${storyData?.title || 'Help'} - Icon`}
                      className="w-auto h-16 md:h-24 lg:h-28 object-contain border rounded border-orange-300 shadow-sm"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div 
                  className="font-handwritten text-gray-800 leading-relaxed [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:text-orange-800 [&>h3]:font-handwritten [&>p]:text-base [&>p]:mb-3 [&>p]:font-handwritten [&>ul]:list-disc [&>ul]:list-inside [&>ul]:mb-3 [&>ul]:font-handwritten [&>ol]:list-decimal [&>ol]:list-inside [&>ol]:mb-3 [&>ol]:font-handwritten [&>li]:mb-1 [&>li]:font-handwritten [&>strong]:font-handwritten [&>em]:font-handwritten" 
                  dangerouslySetInnerHTML={createSafeHtml(helpContent)}
                />
                
                {/* Bottom Left: Webtext Code */}
                {storyData?.story_code && (
                  <div className="flex justify-start mt-4 pt-2 border-t border-orange-200">
                    <div className="bg-orange-200/70 rounded px-3 py-1 text-sm font-mono text-orange-700 border border-orange-300">
                      {storyData.story_code}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          
          {/* Floating Close Button - Bottom Right */}
          <Button
            onClick={onClose}
            className="absolute bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg z-10"
            size="sm"
          >
            <X className="h-4 w-4 mr-1 stroke-2" />
            Close
          </Button>
        </div>
      </DialogContent>
      <SuperAV
        isOpen={isSuperAVOpen}
        onClose={() => setIsSuperAVOpen(false)}
        title={storyData?.title || `Help: ${getPageTitle(currentRoute)}`}
        author={storyData?.author}
        voiceName={storyData?.ai_voice_name}
        audioUrl={storyData?.audio_url}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />
    </Dialog>
  );
};

export default HelpPopup;
