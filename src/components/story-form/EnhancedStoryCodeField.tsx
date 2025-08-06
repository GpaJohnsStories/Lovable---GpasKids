import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useStoryCodeLookup } from "@/hooks/useStoryCodeLookup";
import { toast } from "sonner";

interface EnhancedStoryCodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  onStoryFound: (story: any) => void;
  onConfirmNew: () => void;
  disabled?: boolean;
}

const EnhancedStoryCodeField: React.FC<EnhancedStoryCodeFieldProps> = ({
  value,
  onChange,
  onStoryFound,
  onConfirmNew,
  disabled = false
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [foundStory, setFoundStory] = useState<any>(null);
  const [isNewStory, setIsNewStory] = useState(false);
  const { lookupStoryByCode } = useStoryCodeLookup();

  const handleBlur = async () => {
    if (!value || value.trim() === "") {
      return;
    }

    console.log('🎯 EnhancedStoryCodeField: Looking up story code:', value);
    
    try {
      const story = await lookupStoryByCode(value.trim(), true); // silent mode
      
      if (story) {
        console.log('🎯 EnhancedStoryCodeField: Story found:', story.title);
        setFoundStory(story);
        setIsNewStory(false);
        setShowConfirmDialog(true);
      } else {
        console.log('🎯 EnhancedStoryCodeField: No story found, prompting for new creation');
        setFoundStory(null);
        setIsNewStory(true);
        setShowConfirmDialog(true);
      }
    } catch (error) {
      console.error('🎯 EnhancedStoryCodeField: Error during lookup:', error);
      toast.error("Error looking up story code. Please try again.");
    }
  };

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    
    if (isNewStory) {
      console.log('🎯 EnhancedStoryCodeField: User confirmed new story creation');
      onConfirmNew();
    } else if (foundStory) {
      console.log('🎯 EnhancedStoryCodeField: User confirmed editing existing story');
      onStoryFound(foundStory);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    // Reset the field
    onChange('');
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="story_code" className="text-lg font-semibold text-orange-800">
          Story Code <span className="text-red-500">*</span>
        </Label>
        <Input
          id="story_code"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          onBlur={handleBlur}
          placeholder="e.g., A1B2"
          disabled={disabled}
          className="w-full max-w-xs text-lg font-mono"
          autoFocus
        />
        <p className="text-sm text-gray-600">
          Enter a unique story code to start editing or creating a story
        </p>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isNewStory ? 'Create New Story?' : 'Edit Existing Story?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isNewStory ? (
                <>
                  Story code <strong>{value}</strong> doesn't exist. 
                  Do you want to create a new story with this code?
                </>
              ) : (
                <>
                  Story code <strong>{value}</strong> exists: <strong>{foundStory?.title}</strong>
                  <br />
                  Do you want to edit this existing story?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {isNewStory ? 'Create New Story' : 'Edit Story'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EnhancedStoryCodeField;