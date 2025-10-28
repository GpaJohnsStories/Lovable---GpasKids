
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Users } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

interface AdminStoriesToolbarProps {
  currentView: 'stories' | 'bios';
  onViewChange: (view: 'stories' | 'bios') => void;
  onCreateStory: () => void;
  onCreateBio: () => void;
  groupByAuthor: boolean;
  onToggleGroupByAuthor: () => void;
}

const AdminStoriesToolbar = ({
  currentView,
  onViewChange,
  onCreateStory,
  onCreateBio,
  groupByAuthor,
  onToggleGroupByAuthor
}: AdminStoriesToolbarProps) => {
  const { isViewer } = useUserRole();

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col gap-4">
        {/* View Toggle Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => onViewChange('stories')}
            variant={currentView === 'stories' ? 'default' : 'outline'}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white w-full h-6 text-xs px-1 py-1 font-system"
          >
            <BookOpen className="h-4 w-4" />
            Stories
          </Button>
          <Button
            onClick={() => onViewChange('bios')}
            variant={currentView === 'bios' ? 'default' : 'outline'}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white w-full h-6 text-xs px-1 py-1 font-system"
          >
            <Users className="h-4 w-4" />
            Author Bios
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {currentView === 'stories' && !isViewer && (
            <>
              <Button
                onClick={onCreateStory}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white w-full h-6 text-xs px-1 py-1 font-system"
              >
                <Plus className="h-4 w-4" />
                Create New Story
              </Button>
              <Button
                onClick={onToggleGroupByAuthor}
                variant={groupByAuthor ? 'default' : 'outline'}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white w-full h-6 text-xs px-1 py-1 font-system"
              >
                <Users className="h-4 w-4" />
                {groupByAuthor ? 'Ungroup Stories' : 'Group by Author'}
              </Button>
            </>
          )}
          
          {currentView === 'bios' && !isViewer && (
            <Button
              onClick={onCreateBio}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white w-full h-6 text-xs px-1 py-1 font-system"
            >
              <Plus className="h-4 w-4" />
              Create New Bio
            </Button>
          )}
        </div>

        {/* Status Info */}
        <div className="text-sm text-amber-700">
          <p className="font-medium">
            {currentView === 'stories' ? 'Story Management' : 'Author Bio Management'}
          </p>
          <p className="text-xs mt-1">
            {isViewer ? 'Viewing in read-only mode' : 'Full editing access with audio controls available'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminStoriesToolbar;
