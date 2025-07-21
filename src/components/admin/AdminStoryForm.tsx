
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
  // Validate that it's a proper UUID format or undefined for new stories
  let validatedStoryId: string | undefined;
  
  const candidateId = propStoryId || paramStoryId;
  
  if (candidateId && candidateId !== ':id' && candidateId.length > 10) {
    // Basic validation - should be a UUID-like string
    validatedStoryId = candidateId;
  }

  console.log('🎯 AdminStoryForm: Route params:', { paramStoryId, propStoryId, validatedStoryId });

  return (
    <AdminLayout>
      <SimpleStoryForm
        storyId={validatedStoryId}
        onSave={onSave}
        onCancel={onCancel}
        allowTextToSpeech={true}
        context="admin-story-form"
      />
    </AdminLayout>
  );
};

export default AdminStoryForm;
