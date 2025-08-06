import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface StoryCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storyCode: string;
  storyTitle?: string;
  mode: 'found' | 'not-found';
  onEditExisting?: () => void;
  onCreateNew: () => void;
  onCreateWebtext?: () => void;
}

export const StoryCodeDialog: React.FC<StoryCodeDialogProps> = ({
  open,
  onOpenChange,
  storyCode,
  storyTitle,
  mode,
  onEditExisting,
  onCreateNew,
  onCreateWebtext,
}) => {
  const isFound = mode === 'found';
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold">
            {isFound ? 'Story Code Already Exists' : 'Create New Content'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            {isFound ? (
              <>
                The story code <strong>"{storyCode}"</strong> already exists with the title:
                <br />
                <em>"{storyTitle}"</em>
                <br /><br />
                Would you like to edit the existing story or create a new one?
              </>
            ) : (
              <>
                The story code <strong>"{storyCode}"</strong> doesn't exist yet.
                <br /><br />
                Would you like to create a new story or webtext with this code?
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          {isFound ? (
            <>
              <AlertDialogCancel onClick={onCreateNew}>
                Create New
              </AlertDialogCancel>
              <AlertDialogAction onClick={onEditExisting}>
                Edit Existing
              </AlertDialogAction>
            </>
          ) : (
            <>
              <AlertDialogCancel onClick={onCreateNew}>
                Create Story
              </AlertDialogCancel>
              {onCreateWebtext && (
                <AlertDialogAction onClick={onCreateWebtext}>
                  Create Webtext
                </AlertDialogAction>
              )}
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};