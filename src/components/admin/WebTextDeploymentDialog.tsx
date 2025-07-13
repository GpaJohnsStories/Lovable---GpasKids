import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Globe, MapPin, FileText, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Story {
  id: string;
  story_code: string;
  title: string;
  tagline?: string;
  author: string;
  category: string;
  published: string;
  read_count: number;
  thumbs_up_count?: number;
  thumbs_down_count?: number;
  ok_count?: number;
  created_at: string;
  updated_at: string;
  photo_link_1?: string;
  photo_link_2?: string;
  photo_link_3?: string;
  content?: string;
  excerpt?: string;
  video_url?: string;
  audio_url?: string;
  audio_generated_at?: string;
  audio_segments?: number;
  audio_duration_seconds?: number;
  ai_voice_name?: string;
  ai_voice_model?: string;
}

interface PageMapping {
  storyCode: string;
  pagePath: string;
  placeholderType: 'content' | 'audio' | 'both';
  description: string;
}

interface WebTextDeploymentDialogProps {
  story: Story | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Copy the page mappings from StaticDeploymentSystem
const PAGE_MAPPINGS: PageMapping[] = [
  {
    storyCode: 'SYS-WEL',
    pagePath: 'src/components/WelcomeText.tsx',
    placeholderType: 'content',
    description: 'Homepage welcome message and intro text'
  },
  {
    storyCode: 'SYS-LIB',
    pagePath: 'src/components/LibraryInstructions.tsx',
    placeholderType: 'content',
    description: 'Library page instructional text'
  },
  {
    storyCode: 'SYS-CC1',
    pagePath: 'src/components/CommentsWelcome.tsx',
    placeholderType: 'content',
    description: 'Comments page welcome section and rules'
  },
  {
    storyCode: 'SYS-AGJ',
    pagePath: 'src/pages/About.tsx',
    placeholderType: 'content',
    description: 'About page - About Grandpa John section content'
  },
  {
    storyCode: 'SYS-BDY',
    pagePath: 'src/pages/About.tsx',
    placeholderType: 'content',
    description: 'About page - About Buddy section content'
  }
];

const WebTextDeploymentDialog = ({ 
  story, 
  isOpen, 
  onClose, 
  onSuccess 
}: WebTextDeploymentDialogProps) => {
  const [isDeploying, setIsDeploying] = useState(false);

  if (!story) return null;

  const mapping = PAGE_MAPPINGS.find(m => m.storyCode === story.story_code);

  const handleDeploy = async () => {
    if (!mapping) {
      toast.error("No page mapping found for this story code");
      return;
    }

    setIsDeploying(true);
    
    try {
      toast.loading(`Deploying "${story.title}" to web page...`, { id: 'deploy' });
      
      console.log('🚀 Calling deploy-static-content function with story ID:', story.id);
      const { data, error } = await supabase.functions.invoke('deploy-static-content', {
        body: { storyIds: [story.id] }
      });
      
      if (error) {
        console.error('❌ Deployment error:', error);
        toast.error(`Failed to deploy content: ${error.message}`, { id: 'deploy' });
        return;
      }

      if (data?.success) {
        const { results, summary } = data;
        toast.success(
          `Successfully deployed "${story.title}" to web page!`, 
          { id: 'deploy' }
        );
        
        console.log('✅ Deployment results:', results);
        
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } else {
        toast.error(data?.error || 'Deployment failed', { id: 'deploy' });
      }
      
    } catch (error) {
      console.error('Deployment error:', error);
      toast.error("Failed to deploy content", { id: 'deploy' });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-center text-red-600 font-bold text-xl bg-yellow-300 py-2 rounded">
            Deploy WebText to Web Page
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="text-center py-2">
            <p className="text-blue-600 font-medium text-base">
              This will deploy the WebText content directly to the web page file.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* WebText Details Column */}
            <div className="p-3 border rounded-lg bg-blue-50">
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" />
                WebText Details  Code: {story.story_code}
              </h3>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Title:  </span>
                  <span className="text-xs">{story.title}</span>
                </div>
                <div>
                  <span className="font-medium">Author:  </span>
                  <span className="text-xs">{story.author}</span>
                </div>
                <div>
                  <span className="font-medium">Updated:  </span>
                  <span className="text-xs">{new Date(story.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Deployment Destination Column */}
            <div className={`p-3 border rounded-lg ${mapping ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                {mapping ? `Deployment Destination  File: ${mapping.pagePath.split('/').pop()}` : 'No Mapping Found'}
              </h3>
              {mapping ? (
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Full Path:  </span>
                    <span className="text-xs break-all">{mapping.pagePath}</span>
                  </div>
                  <div>
                    <span className="font-medium">Description:  </span>
                    <span className="text-xs">{mapping.description}</span>
                  </div>
                  <div>
                    <span className="font-medium">Type:  </span>
                    <span className="text-xs">{mapping.placeholderType}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-red-600">
                  Story code ({story.story_code}) has no page mapping. Deployment not possible.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              onClick={onClose}
              disabled={isDeploying}
              className="bg-yellow-300 text-black px-4 py-2 rounded-full font-bold hover:bg-yellow-200 text-lg"
            >
              Cancel
            </button>
            <Button
              onClick={handleDeploy}
              disabled={!mapping || isDeploying}
              className="bg-gradient-to-b from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white border-red-700 font-bold"
            >
              <Globe className="h-4 w-4 mr-2" />
              {isDeploying ? "Deploying..." : "Click to Confirm Deployment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WebTextDeploymentDialog;