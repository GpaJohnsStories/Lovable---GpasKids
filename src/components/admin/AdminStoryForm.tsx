
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

  // Enhanced context restoration for new tabs
  useEffect(() => {
    const handleNewTabSetup = () => {
      try {
        // Check if this is a new tab opened for editing
        const isNewTab = window.opener && !window.opener.closed;
        
        if (isNewTab) {
          console.log('🎯 AdminStoryForm: New tab detected for editing');
          
          // Store context for this new tab
          const editContext = {
            editingStoryId: validatedStoryId,
            openedAt: Date.now(),
            parentTabOrigin: window.location.origin
          };
          
          sessionStorage.setItem('admin-edit-context', JSON.stringify(editContext));
          
          // Send message to parent tab that we're ready
          window.opener.postMessage({
            type: 'ADMIN_TAB_READY',
            storyId: validatedStoryId,
            timestamp: Date.now()
          }, window.location.origin);
        }
        
        // Check for stored context from parent tab navigation
        const storedContext = sessionStorage.getItem('admin-edit-context');
        if (storedContext && !isNewTab) {
          const context = JSON.parse(storedContext);
          console.log('🎯 AdminStoryForm: Found stored edit context:', context);
        }
      } catch (error) {
        console.error('Error handling new tab setup:', error);
      }
    };

    handleNewTabSetup();
  }, [validatedStoryId, location]);

  const handleSaveWithContext = () => {
    console.log('🎯 AdminStoryForm: Save with enhanced context preservation');
    
    // Call the original save handler
    onSave();
    
    // Enhanced new tab handling
    if (window.opener && !window.opener.closed) {
      try {
        // Communicate success to parent tab
        window.opener.postMessage({
          type: 'ADMIN_STORY_SAVED',
          storyId: validatedStoryId,
          timestamp: Date.now(),
          action: 'saved'
        }, window.location.origin);
        
        // Show a brief success message before closing
        console.log('✅ Story saved successfully. Closing tab...');
        
        // Close this tab after a short delay to show feedback
        setTimeout(() => {
          window.close();
        }, 1500);
      } catch (error) {
        console.error('Error communicating with parent tab:', error);
        // Fallback: try to close anyway
        setTimeout(() => window.close(), 1000);
      }
    }
  };

  const handleCancelWithContext = () => {
    console.log('🎯 AdminStoryForm: Cancel with enhanced context preservation');
    
    // Enhanced new tab handling
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage({
          type: 'ADMIN_STORY_CANCELLED',
          storyId: validatedStoryId,
          timestamp: Date.now(),
          action: 'cancelled'
        }, window.location.origin);
        
        // Close immediately on cancel
        window.close();
      } catch (error) {
        console.error('Error communicating with parent tab:', error);
        onCancel(); // Fallback to normal cancel
      }
    } else {
      onCancel();
    }
  };

  // Enhanced message listener for parent-child tab communication
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      console.log('🎯 AdminStoryForm: Received message:', event.data);
      
      switch (event.data.type) {
        case 'ADMIN_STORY_SAVED':
          console.log('🎯 AdminStoryForm: Received save notification from child tab');
          // Refresh the current view to show updated data
          window.location.reload();
          break;
          
        case 'ADMIN_STORY_CANCELLED':
          console.log('🎯 AdminStoryForm: Received cancel notification from child tab');
          // No action needed for cancel, but we could show a toast
          break;
          
        case 'ADMIN_TAB_READY':
          console.log('🎯 AdminStoryForm: Child tab is ready for editing');
          // The child tab has loaded and is ready to receive data
          break;
          
        default:
          break;
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
