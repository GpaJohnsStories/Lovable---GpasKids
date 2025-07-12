import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Upload, 
  FileText, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  RotateCcw,
  Eye,
  Code,
  Globe
} from "lucide-react";
import { toast } from "sonner";
import { adminClient } from "@/integrations/supabase/clients";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "./AdminLayout";

interface SystemStory {
  id: string;
  story_code: string;
  title: string;
  author: string;
  content: string;
  audio_url?: string;
  updated_at: string;
}

interface PageMapping {
  storyCode: string;
  pagePath: string;
  placeholderType: 'content' | 'audio' | 'both';
  description: string;
}

// Define the mapping of web-text codes to page locations
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
  // Other page mappings removed - titles like "Latest Announcements" are now hardcoded
];

const StaticDeploymentSystem = () => {
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentPreview, setDeploymentPreview] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch System category stories
  const { data: systemStories, isLoading, refetch } = useQuery({
    queryKey: ['system-stories'],
    queryFn: async () => {
      const { data, error } = await adminClient
        .from('stories')
        .select('*')
        .eq('category', 'System')
        .order('story_code', { ascending: true });
      
      if (error) throw error;
      return data as SystemStory[];
    },
  });

  // Find which stories have corresponding page mappings
  const mappedStories = systemStories?.filter(story => 
    PAGE_MAPPINGS.some(mapping => mapping.storyCode === story.story_code)
  ) || [];

  const unmappedStories = systemStories?.filter(story => 
    !PAGE_MAPPINGS.some(mapping => mapping.storyCode === story.story_code)
  ) || [];

  const handleStorySelection = (storyId: string, checked: boolean) => {
    if (checked) {
      setSelectedStories(prev => [...prev, storyId]);
    } else {
      setSelectedStories(prev => prev.filter(id => id !== storyId));
    }
  };

  const generatePreview = async () => {
    if (selectedStories.length === 0) {
      toast.error("Please select at least one story to preview");
      return;
    }

    const selectedStoriesData = systemStories?.filter(story => 
      selectedStories.includes(story.id)
    ) || [];

    const preview = selectedStoriesData.map(story => {
      const mapping = PAGE_MAPPINGS.find(m => m.storyCode === story.story_code);
      return {
        story,
        mapping,
        changes: {
          contentPlaceholder: `<!-- STORY_CODE:${story.story_code}:CONTENT -->`,
          audioPlaceholder: `<!-- STORY_CODE:${story.story_code}:AUDIO -->`,
          newContent: story.content,
          newAudio: story.audio_url
        }
      };
    });

    setDeploymentPreview(preview);
    setShowPreview(true);
  };

  const deployToWeb = async () => {
    if (!deploymentPreview || deploymentPreview.length === 0) {
      toast.error("Please generate a preview first");
      return;
    }

    setIsDeploying(true);
    
    try {
      toast.loading("Deploying content to web pages...", { id: 'deploy' });
      
      // Extract story IDs from the preview
      const storyIds = deploymentPreview.map((item: any) => item.story.id);
      
      console.log('🚀 Calling deploy-static-content function with story IDs:', storyIds);
      const { data, error } = await adminClient.functions.invoke('deploy-static-content', {
        body: { storyIds }
      });
      
      if (error) {
        console.error('❌ Deployment error:', error);
        toast.error(`Failed to deploy content: ${error.message}`, { id: 'deploy' });
        return;
      }

      if (data?.success) {
        const { results, summary } = data;
        toast.success(
          `Successfully deployed ${summary.successful}/${summary.total} stories to web pages!`, 
          { id: 'deploy' }
        );
        
        console.log('✅ Deployment results:', results);
        
        // Reset state
        setSelectedStories([]);
        setDeploymentPreview(null);
        setShowPreview(false);
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

  const getStoryMappingInfo = (storyCode: string) => {
    return PAGE_MAPPINGS.find(mapping => mapping.storyCode === storyCode);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-amber-800">Static Web-Text Deployment System</h1>
            <p className="text-amber-600 mt-1">Deploy System web-text pieces directly to web pages for improved performance</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={generatePreview}
              disabled={selectedStories.length === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview Changes
            </Button>
            <Button
              onClick={deployToWeb}
              disabled={!showPreview || isDeploying}
              className="cozy-button flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {isDeploying ? "Deploying..." : "Deploy to Web"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="deployment" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="mappings">Page Mappings</TabsTrigger>
            <TabsTrigger value="preview" disabled={!showPreview}>Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="deployment" className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This system replaces dynamic content loading with static content embedded directly in page files. 
                This improves performance but requires redeployment when content changes.
              </AlertDescription>
            </Alert>

            {isLoading ? (
              <div className="text-center py-8">Loading System stories...</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mapped Stories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      Deployable Stories ({mappedStories.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mappedStories.map(story => {
                      const mapping = getStoryMappingInfo(story.story_code);
                      const isSelected = selectedStories.includes(story.id);
                      
                      return (
                        <div key={story.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleStorySelection(story.id, checked as boolean)}
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{story.title}</h4>
                              <Badge variant="secondary">{story.story_code}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{mapping?.description}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="h-3 w-3 mr-1" />
                                {mapping?.pagePath}
                              </Badge>
                              <Badge variant={mapping?.placeholderType === 'both' ? 'default' : 'secondary'} className="text-xs">
                                {mapping?.placeholderType}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500">
                              Updated: {new Date(story.updated_at).toLocaleDateString()}
                              {story.audio_url && <span className="ml-2">🎵 Has Audio</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {mappedStories.length === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        No deployable System stories found. Create stories with codes that match page mappings.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Unmapped Stories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-5 w-5" />
                      Unmapped Stories ({unmappedStories.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {unmappedStories.map(story => (
                      <div key={story.id} className="p-3 border rounded-lg bg-amber-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{story.title}</h4>
                          <Badge variant="outline">{story.story_code}</Badge>
                        </div>
                        <p className="text-sm text-amber-700">
                          No page mapping found. Add this story code to PAGE_MAPPINGS to enable deployment.
                        </p>
                      </div>
                    ))}
                    
                    {unmappedStories.length === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        All System stories have page mappings! 🎉
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="mappings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Page Mapping Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PAGE_MAPPINGS.map((mapping, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{mapping.storyCode}</h4>
                        <Badge variant={mapping.placeholderType === 'both' ? 'default' : 'secondary'}>
                          {mapping.placeholderType}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{mapping.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <FileText className="h-3 w-3" />
                        <code className="bg-gray-100 px-2 py-1 rounded">{mapping.pagePath}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {deploymentPreview && (
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {deploymentPreview.map((item: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">{item.story.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{item.mapping?.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium mb-1">Target File:</h5>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{item.mapping?.pagePath}</code>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium mb-1">Changes:</h5>
                          <div className="text-xs space-y-1">
                            <div>Content placeholder: <code>{item.changes.contentPlaceholder}</code></div>
                            {item.mapping?.placeholderType === 'both' && (
                              <div>Audio placeholder: <code>{item.changes.audioPlaceholder}</code></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default StaticDeploymentSystem;