
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface StoryFormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

const StoryFormActions: React.FC<StoryFormActionsProps> = ({ isLoading, onCancel }) => {
  const handleSaveClick = () => {
    console.log('Save button clicked directly!');
  };

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
        onClick={handleSaveClick}
      >
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Saving...' : 'Save Story'}
      </Button>
    </div>
  );
};

export default StoryFormActions;
