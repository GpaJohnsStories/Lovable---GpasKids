import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";
import StoriesTable from "./StoriesTable";
import AdminStoryForm from "./AdminStoryForm";
import AdminStoryPreview from "./AdminStoryPreview";
import AuthorBiosTable from "./AuthorBiosTable";
import AuthorBioForm from "./AuthorBioForm";
import AdminLayout from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";

const AdminStories = () => {
  const [searchParams] = useSearchParams();
  const [selectedStory, setSelectedStory] = useState(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [previewStory, setPreviewStory] = useState(null);
  const [currentView, setCurrentView] = useState<'stories' | 'bios'>('stories');
  const [selectedBio, setSelectedBio] = useState(null);
  const [isCreatingBio, setIsCreatingBio] = useState(false);
  const [groupByAuthor, setGroupByAuthor] = useState(false);
  const [bioEditSource, setBioEditSource] = useState<'stories' | 'bios'>('bios');

  // Check URL parameters for initial view
  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam === 'bios' || viewParam === 'stories') {
      setCurrentView(viewParam);
    }
  }, [searchParams]);

  const handleEditStory = (story: any) => {
    setSelectedStory(story);
    setIsCreatingStory(false);
    setPreviewStory(null);
  };

  const handleCreateStory = () => {
    setSelectedStory(null);
    setIsCreatingStory(true);
    setPreviewStory(null);
  };

  const handleBackToStories = () => {
    setSelectedStory(null);
    setIsCreatingStory(false);
    setPreviewStory(null);
    setSelectedBio(null);
    setIsCreatingBio(false);
  };

  const handlePreviewStory = (story: any) => {
    setPreviewStory(story);
    setSelectedStory(null);
    setIsCreatingStory(false);
  };

  const handleEditBio = (bio: any) => {
    setBioEditSource('bios');
    setSelectedBio(bio);
    setIsCreatingBio(false);
  };

  const handleEditBioByAuthorName = async (authorName: string) => {
    setBioEditSource('stories');
    try {
      // Try to find existing bio
      const { data: existingBio } = await supabase
        .from('author_bios')
        .select('*')
        .eq('author_name', authorName)
        .maybeSingle();
      
      if (existingBio) {
        setSelectedBio(existingBio);
      } else {
        // Create new bio with the author name pre-filled
        setSelectedBio({ author_name: authorName, bio_content: '' });
      }
      setIsCreatingBio(false);
    } catch (error) {
      console.error('Error fetching author bio:', error);
      // If there's an error, create a new bio
      setSelectedBio({ author_name: authorName, bio_content: '' });
      setIsCreatingBio(false);
    }
  };

  const handleCreateBio = () => {
    setSelectedBio(null);
    setIsCreatingBio(true);
  };

  const handleBackToBios = () => {
    setSelectedBio(null);
    setIsCreatingBio(false);
  };

  if (selectedStory || isCreatingStory) {
    return (
      <AdminStoryForm
        editingStory={selectedStory}
        onSave={handleBackToStories}
        onCancel={handleBackToStories}
      />
    );
  }

  if (selectedBio || isCreatingBio) {
    return (
      <AuthorBioForm
        bio={selectedBio}
        onBack={bioEditSource === 'stories' ? handleBackToStories : handleBackToBios}
        onSave={bioEditSource === 'stories' ? handleBackToStories : handleBackToBios}
        backButtonText={bioEditSource === 'stories' ? "Back to Admin Story List" : "Back to Bios"}
      />
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-0">
        <div className="flex justify-between items-center py-1">
          <div className="flex gap-2 items-center">
            <h2 className="text-lg font-bold">
              {currentView === 'stories' ? 'Stories' : 'Author Bios'}
            </h2>
            <div className="flex gap-1">
              <Button 
                variant={currentView === 'stories' ? 'default' : 'outline'}
                onClick={() => setCurrentView('stories')}
                size="sm"
                className="h-7 px-2 text-xs"
              >
                Stories
              </Button>
              <Button 
                variant={currentView === 'bios' ? 'default' : 'outline'}
                onClick={() => setCurrentView('bios')}
                size="sm"
                className="h-7 px-2 text-xs"
              >
                <Users className="h-3 w-3 mr-1" />
                Bios
              </Button>
            </div>
          </div>
          
          <div className="flex gap-1">
            {currentView === 'stories' && (
              <>
                <Button 
                  variant={groupByAuthor ? 'default' : 'outline'}
                  onClick={() => setGroupByAuthor(!groupByAuthor)}
                  size="sm"
                  className="h-7 px-2 text-xs"
                >
                  Group by Author
                </Button>
                <Button 
                  onClick={handleCreateStory} 
                  size="sm" 
                  className="cozy-button h-7 px-2 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Create Story
                </Button>
              </>
            )}
          </div>
        </div>
        
        {currentView === 'stories' ? (
          <StoriesTable 
            onEditStory={handleEditStory}
            showActions={true}
            showPublishedColumn={true}
            groupByAuthor={groupByAuthor}
            onEditBio={handleEditBioByAuthorName}
          />
        ) : (
          <AuthorBiosTable
            onEditBio={handleEditBio}
            onCreateBio={handleCreateBio}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStories;