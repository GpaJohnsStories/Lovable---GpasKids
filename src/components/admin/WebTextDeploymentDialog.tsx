
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileText, MapPin, Globe, CheckCircle } from "lucide-react";
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

// Page mappings for webtext deployment
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
  },
  {
    storyCode: 'SYS-THY',
    pagePath: 'src/pages/About.tsx',
    placeholderType: 'content',
    description: 'About page - Thank You section content'
  },
  {
    storyCode: 'SYS-CPR',
    pagePath: 'src/pages/About.tsx',
    placeholderType: 'content',
    description: 'About page - Copyright section content'
  }
];

const WebTextDeploymentDialog = ({ 
  story, 
  isOpen, 
  onClose, 
  onSuccess 
}: WebTextDeploymentDialogProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentComplete, setDeploymentComplete] = useState(false);

  if (!story) return null;

  const mapping = PAGE_MAPPINGS.find(m => m.storyCode === story.story_code);

  const handleDeploy = async () => {
    if (!mapping) {
      toast.error("No page mapping found for this story code");
      return;
    }

    setIsDeploying(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('deploy-static-content', {
        body: { storyIds: [story.id] }
      });
      
      if (error) {
        toast.error(`Failed to deploy content: ${error.message}`);
        return;
      }

      if (data?.success) {
        setDeploymentComplete(true);
        toast.success(`Successfully deployed "${story.title}" to web page!`);
        
        // Close dialog after a short delay to show success state
        setTimeout(() => {
          setDeploymentComplete(false);
          onClose();
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        toast.error(data?.error || 'Deployment failed');
      }
      
    } catch (error) {
      console.error('Deployment error:', error);
      toast.error("Failed to deploy content");
    } finally {
      setIsDeploying(false);
    }
  };

  const handleClose = () => {
    if (!isDeploying && !deploymentComplete) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">
            Deploy WebText to Web Page
          </DialogTitle>
          <DialogDescription className="text-center">
            Deploy content directly to the web page
          </DialogDescription>
        </DialogHeader>

        {deploymentComplete ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-700 mb-2">Deployment Successful!</h3>
            <p className="text-gray-600">Content has been deployed to the web page.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* WebText Details */}
              <div className="p-4 border rounded-lg bg-blue-50">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  WebText Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Code:</strong> {story.story_code}</div>
                  <div><strong>Title:</strong> {story.title}</div>
                  <div><strong>Author:</strong> {story.author}</div>
                  <div><strong>Updated:</strong> {new Date(story.updated_at).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Deployment Target */}
              <div className={`p-4 border rounded-lg ${mapping ? 'bg-green-50' : 'bg-red-50'}`}>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Deployment Target
                </h3>
                {mapping ? (
                  <div className="space-y-2 text-sm">
                    <div><strong>File:</strong> {mapping.pagePath.split('/').pop()}</div>
                    <div><strong>Path:</strong> {mapping.pagePath}</div>
                    <div><strong>Type:</strong> {mapping.placeholderType}</div>
                    <div><strong>Description:</strong> {mapping.description}</div>
                  </div>
                ) : (
                  <p className="text-sm text-red-600">
                    No mapping found for story code: {story.story_code}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isDeploying}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeploy}
                disabled={!mapping || isDeploying}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Globe className="h-4 w-4 mr-2" />
                {isDeploying ? "Deploying..." : "Deploy to Web Page"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WebTextDeploymentDialog;
