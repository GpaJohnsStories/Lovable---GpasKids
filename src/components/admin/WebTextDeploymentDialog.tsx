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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-800">
            <Globe className="h-5 w-5" />
            Deploy WebText to Web Page
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This will deploy the WebText content directly to the web page file. 
              The change will be visible immediately after deployment.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <h3 className="font-semibold mb-2">WebText Details</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Code:</span>
                  <Badge variant="secondary">{story.story_code}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Title:</span>
                  <span className="text-sm">{story.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Author:</span>
                  <span className="text-sm">{story.author}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Last Updated:</span>
                  <span className="text-sm">{new Date(story.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {mapping ? (
              <div className="p-4 border rounded-lg bg-green-50">
                <h3 className="font-semibold mb-2">Deployment Destination</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{mapping.pagePath}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{mapping.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={mapping.placeholderType === 'both' ? 'default' : 'secondary'} className="text-xs">
                      {mapping.placeholderType}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border rounded-lg bg-red-50">
                <h3 className="font-semibold mb-2 text-red-700">No Deployment Mapping</h3>
                <p className="text-sm text-red-600">
                  This story code ({story.story_code}) does not have a page mapping configured. 
                  Deployment is not possible.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isDeploying}
              >
                Cancel
              </Button>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WebTextDeploymentDialog;