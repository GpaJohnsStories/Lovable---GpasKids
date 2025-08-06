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
  storyTitle: string;
  onEditExisting: () => void;
  onCreateNew: () => void;
}

export const StoryCodeDialog: React.FC<StoryCodeDialogProps> = ({
  open,
  onOpenChange,
  storyCode,
  storyTitle,
  onEditExisting,
  onCreateNew,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold">
            Story Code Already Exists
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            The story code <strong>"{storyCode}"</strong> already exists with the title:
            <br />
            <em>"{storyTitle}"</em>
            <br /><br />
            Would you like to edit the existing story or create a new one?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel onClick={onCreateNew}>
            Create New
          </AlertDialogCancel>
          <AlertDialogAction onClick={onEditExisting}>
            Edit Existing
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};