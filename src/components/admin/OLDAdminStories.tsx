
import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import StoriesTable from "./StoriesTable";
import AdminStoryForm from "./AdminStoryForm";
import AdminStoryPreview from "./AdminStoryPreview";
import AuthorBiosTable from "./AuthorBiosTable";
import AuthorBioForm from "./AuthorBioForm";
import AdminLayout from "./AdminLayout";
import AdminStoriesToolbar from "./AdminStoriesToolbar";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";

const AdminStories = () => {
  const { isViewer } = useUserRole();
  const [searchParams] = useSearchParams();
  const [selectedStory, setSelectedStory] = useState(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [previewStory, setPreviewStory] = useState(null);
  const [currentView, setCurrentView] = useState<'stories' | 'bios'>('stories');
  const [selectedBio, setSelectedBio] = useState(null);
  const [isCreatingBio, setIsCreatingBio] = useState(false);
  const [groupByAuthor, setGroupByAuthor] = useState(false);
  const [bioEditSource, setBioEditSource] = useState<'stories' | 'bios'>('bios');

  // Check URL parameters for initial view only
  useEffect(() => {
    const viewParam = searchParams.get('view');
    
    if (viewParam === 'bios' || viewParam === 'stories') {
      setCurrentView(viewParam);
    }
    
    // Only trigger story creation if explicitly navigated to this URL
    // Don't trigger on page refresh or Ctrl+R
    const actionParam = searchParams.get('action');
    if (actionParam === 'create' && document.referrer.includes('/buddys_admin')) {
      handleCreateStory();
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
      <div className="space-y-4">
        <AdminStoriesToolbar
          currentView={currentView}
          onViewChange={setCurrentView}
          onCreateStory={handleCreateStory}
          onCreateBio={handleCreateBio}
          groupByAuthor={groupByAuthor}
          onToggleGroupByAuthor={() => setGroupByAuthor(!groupByAuthor)}
        />
        
        {currentView === 'stories' ? (
          <StoriesTable 
            onEditStory={isViewer ? undefined : handleEditStory}
            showActions={!isViewer}
            showPublishedColumn={true}
            groupByAuthor={groupByAuthor}
            onToggleGroupByAuthor={() => setGroupByAuthor(!groupByAuthor)}
            onEditBio={isViewer ? undefined : handleEditBioByAuthorName}
          />
        ) : (
          <AuthorBiosTable
            onEditBio={isViewer ? undefined : handleEditBio}
            onCreateBio={isViewer ? undefined : handleCreateBio}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminStories;
