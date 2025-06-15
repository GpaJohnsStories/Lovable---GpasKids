
import StoryForm from "@/components/StoryForm";

interface AdminStoryFormProps {
  editingStory: any;
  onSave: () => void;
  onCancel: () => void;
}

const AdminStoryForm = ({ editingStory, onSave, onCancel }: AdminStoryFormProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 py-8" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: 'black' }}>
      <div className="container mx-auto px-4">
        <StoryForm
          story={editingStory}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

export default AdminStoryForm;
