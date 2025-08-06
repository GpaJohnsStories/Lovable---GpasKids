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
  onYes: () => void;
  onNo: () => void;
}

export const StoryCodeDialog: React.FC<StoryCodeDialogProps> = ({
  open,
  onOpenChange,
  storyCode,
  storyTitle,
  mode,
  onEditExisting,
  onYes,
  onNo,
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
                Would you like to edit the existing story?
              </>
            ) : (
              <>
                The story code <strong>"{storyCode}"</strong> doesn't exist yet.
                <br /><br />
                Would you like to add a new story or webtext with this code?
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel 
            onClick={onNo}
            className="bg-red-500 hover:bg-red-600 text-white border-red-500"
          >
            No
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={isFound ? onEditExisting : onYes}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};