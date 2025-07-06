import AdminHeader from "./AdminHeader";
import CreateStoryCard from "./CreateStoryCard";
import StoriesTable from "./StoriesTable";
import AdminLayout from "./AdminLayout";

interface AdminStoriesProps {
  onCreateStory: () => void;
  onEditStory: (story: any) => void;
}

const AdminStories = ({ onCreateStory, onEditStory }: AdminStoriesProps) => {
  console.log('AdminStories: Rendering with props', { onCreateStory, onEditStory });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Manage Stories
        </h1>
        <p className="text-gray-600 mt-2">Create, edit, and organize your stories</p>
      </div>
      
      <div className="mb-6">
        <CreateStoryCard onCreateStory={onCreateStory} />
      </div>
      
      <StoriesTable onEditStory={onEditStory} />
    </AdminLayout>
  );
};

export default AdminStories;