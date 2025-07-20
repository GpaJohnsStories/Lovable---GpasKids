
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
import { HelpCircle, X, Keyboard } from "lucide-react";
import StoryContentRenderer from "@/components/content/StoryContentRenderer";

interface HelpPopupProps {
  isOpen: boolean;
  onClose: () => void;
  helpContent: string;
  isLoading: boolean;
  currentRoute: string;
}

const HelpPopup: React.FC<HelpPopupProps> = ({
  isOpen,
  onClose,
  helpContent,
  isLoading,
  currentRoute
}) => {
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
        className="max-w-4xl max-h-[80vh] bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-orange-200"
        style={{ fontFamily: "'Kalam', 'Caveat', cursive, sans-serif" }}
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-orange-200">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-6 w-6 text-orange-600" />
            <DialogTitle className="text-xl font-bold text-orange-800">
              Help: {getPageTitle(currentRoute)}
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <Keyboard className="h-4 w-4" />
            <span>Press Ctrl+H for help</span>
          </div>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <span className="ml-3 text-orange-700">Loading help content...</span>
            </div>
          ) : (
            <ScrollArea className="h-[50vh] w-full rounded-md border border-orange-200 bg-white/50 p-4">
              <div className="prose prose-orange max-w-none">
                <StoryContentRenderer 
                  content={helpContent}
                  className="text-gray-800 leading-relaxed"
                />
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-orange-200">
          <div className="text-sm text-orange-600 flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span>Need more help? Contact us through the About page!</span>
          </div>
          <Button
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Close Help
          </Button>
        </div>

        <DialogClose asChild>
          <Button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            variant="ghost"
            size="sm"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default HelpPopup;
