
import React from 'react';
import { useParams } from 'react-router-dom';
import SimpleStoryForm from '@/components/story-form/SimpleStoryForm';
import AdminLayout from './AdminLayout';

interface AdminStoryFormProps {
  storyId?: string;
  onSave: () => void;
  onCancel: () => void;
}

const AdminStoryForm: React.FC<AdminStoryFormProps> = ({ storyId: propStoryId, onSave, onCancel }) => {
  const { id: paramStoryId } = useParams<{ id?: string }>();
  
  // Use prop storyId if provided, otherwise fall back to URL param
  const storyId = propStoryId || paramStoryId;

  return (
    <AdminLayout>
      <SimpleStoryForm
        storyId={storyId}
        onSave={onSave}
        onCancel={onCancel}
      />
    </AdminLayout>
  );
};

export default AdminStoryForm;
