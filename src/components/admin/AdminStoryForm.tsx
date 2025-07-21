
import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SimpleStoryForm from '@/components/story-form/SimpleStoryForm';
import AdminLayout from './AdminLayout';

interface AdminStoryFormProps {
  storyId?: string;
  onSave: () => void;
  onCancel: () => void;
}

const AdminStoryForm: React.FC<AdminStoryFormProps> = ({ storyId: propStoryId, onSave, onCancel }) => {
  const { id: paramStoryId } = useParams<{ id?: string }>();
  const location = useLocation();
  
  // Use prop storyId if provided, otherwise fall back to URL param
  // Validate that it's a proper UUID format or undefined for new stories
  let validatedStoryId: string | undefined;
  
  const candidateId = propStoryId || paramStoryId;
  
  if (candidateId && candidateId !== ':id' && candidateId.length > 10) {
    // Basic validation - should be a UUID-like string
    validatedStoryId = candidateId;
  }

  console.log('🎯 AdminStoryForm: Route params:', { paramStoryId, propStoryId, validatedStoryId });

  // Handle context restoration when returning from edit
  useEffect(() => {
    const handleReturnFromEdit = () => {
      try {
        const storedContext = sessionStorage.getItem('admin-edit-context');
        if (storedContext) {
          const context = JSON.parse(storedContext);
          
          // If this was opened in a new tab and we're editing a story, store return info
          if (validatedStoryId && window.opener) {
            console.log('🎯 AdminStoryForm: Detected new tab editing context');
            
            // Store return information for potential use
            sessionStorage.setItem('admin-edit-return', JSON.stringify({
              parentTabContext: context,
              editingStoryId: validatedStoryId,
              openedAt: Date.now()
            }));
          }
        }
      } catch (error) {
        console.error('Error handling return context:', error);
      }
    };

    handleReturnFromEdit();
  }, [validatedStoryId, location]);

  const handleSaveWithContext = () => {
    console.log('🎯 AdminStoryForm: Save with context preservation');
    
    // Call the original save handler
    onSave();
    
    // If this was opened in a new tab, handle the return
    if (window.opener && !window.opener.closed) {
      try {
        // Try to communicate with parent tab
        window.opener.postMessage({
          type: 'ADMIN_STORY_SAVED',
          storyId: validatedStoryId,
          timestamp: Date.now()
        }, window.location.origin);
        
        // Close this tab after a short delay
        setTimeout(() => {
          window.close();
        }, 1000);
      } catch (error) {
        console.error('Error communicating with parent tab:', error);
      }
    }
  };

  const handleCancelWithContext = () => {
    console.log('🎯 AdminStoryForm: Cancel with context preservation');
    
    // If this was opened in a new tab, just close it
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage({
          type: 'ADMIN_STORY_CANCELLED',
          storyId: validatedStoryId,
          timestamp: Date.now()
        }, window.location.origin);
        
        window.close();
      } catch (error) {
        console.error('Error communicating with parent tab:', error);
        onCancel(); // Fallback to normal cancel
      }
    } else {
      onCancel();
    }
  };

  // Listen for messages from child tabs
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'ADMIN_STORY_SAVED') {
        console.log('🎯 AdminStoryForm: Received save notification from child tab');
        // Refresh the current page or trigger a re-fetch
        window.location.reload();
      } else if (event.data.type === 'ADMIN_STORY_CANCELLED') {
        console.log('🎯 AdminStoryForm: Received cancel notification from child tab');
        // No action needed for cancel
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <AdminLayout>
      <SimpleStoryForm
        storyId={validatedStoryId}
        onSave={handleSaveWithContext}
        onCancel={handleCancelWithContext}
        allowTextToSpeech={true}
        context="admin-story-form"
      />
    </AdminLayout>
  );
};

export default AdminStoryForm;
