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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-800">
            <Globe className="h-5 w-5" />
            Deploy WebText to Web Page
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This will deploy the WebText content directly to the web page file.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-6">
            {/* WebText Details Column */}
            <div className="p-4 border rounded-lg bg-blue-50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                WebText Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Code:</span>
                  <Badge variant="secondary">{story.story_code}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Title:</span>
                  <span className="truncate ml-2">{story.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Author:</span>
                  <span>{story.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Updated:</span>
                  <span>{new Date(story.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Deployment Destination Column */}
            <div className={`p-4 border rounded-lg ${mapping ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {mapping ? 'Deployment Destination' : 'No Mapping Found'}
              </h3>
              {mapping ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium block mb-1">File:</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded block break-all">
                      {mapping.pagePath}
                    </code>
                  </div>
                  <div>
                    <span className="font-medium block mb-1">Description:</span>
                    <span className="text-sm">{mapping.description}</span>
                  </div>
                  <div>
                    <span className="font-medium block mb-1">Type:</span>
                    <Badge variant={mapping.placeholderType === 'both' ? 'default' : 'secondary'} className="text-xs">
                      {mapping.placeholderType}
                    </Badge>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-red-600">
                  Story code ({story.story_code}) has no page mapping. Deployment not possible.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
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
      </DialogContent>
    </Dialog>
  );
};

export default WebTextDeploymentDialog;