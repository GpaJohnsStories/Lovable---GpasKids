
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface StoryFormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

const StoryFormActions: React.FC<StoryFormActionsProps> = ({ isLoading, onCancel }) => {
  console.log('=== StoryFormActions RENDERING ===', { isLoading });
  console.log('=== onCancel function:', typeof onCancel);
  
  return (
    <div className="flex justify-end space-x-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="cozy-button"
        onClick={() => console.log('=== SAVE BUTTON CLICKED - Should trigger form submit ===')}
      >
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Saving...' : 'Save Story'}
      </Button>
    </div>
  );
};

export default StoryFormActions;
