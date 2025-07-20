
import React from 'react';
import { useParams } from 'react-router-dom';
import SimpleStoryForm from '@/components/story-form/SimpleStoryForm';
import AdminLayout from './AdminLayout';

interface AdminStoryFormProps {
  onSave: () => void;
  onCancel: () => void;
}

const AdminStoryForm: React.FC<AdminStoryFormProps> = ({ onSave, onCancel }) => {
  const { id } = useParams<{ id?: string }>();

  return (
    <AdminLayout>
      <SimpleStoryForm
        storyId={id}
        onSave={onSave}
        onCancel={onCancel}
      />
    </AdminLayout>
  );
};

export default AdminStoryForm;
