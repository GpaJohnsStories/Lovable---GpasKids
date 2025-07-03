
import React from 'react';
import StoryFormContainer from '@/components/StoryFormContainer';
import AdminLayout from './AdminLayout';

interface Story {
  id?: string;
  title: string;
  author: string;
  category: "Fun" | "Life" | "North Pole" | "World Changers" | "System";
  content: string;
  tagline: string;
  excerpt: string;
  story_code: string;
  google_drive_link: string;
  photo_link_1: string;
  photo_link_2: string;
  photo_link_3: string;
  photo_alt_1: string;
  photo_alt_2: string;
  photo_alt_3: string;
  video_url: string;
  published: string;
}

interface AdminStoryFormProps {
  editingStory?: Story;
  onSave: () => void;
  onCancel: () => void;
}

const AdminStoryForm: React.FC<AdminStoryFormProps> = ({ editingStory, onSave, onCancel }) => {
  return (
    <AdminLayout>
      <StoryFormContainer
        story={editingStory}
        onSave={onSave}
        onCancel={onCancel}
      />
    </AdminLayout>
  );
};

export default AdminStoryForm;
