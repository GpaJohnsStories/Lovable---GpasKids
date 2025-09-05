
import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommentPopupDialog from "./CommentPopupDialog";

interface CreateCommentButtonProps {
  storyCode: string;
  storyTitle: string;
}

const CreateCommentButton = ({ storyCode, storyTitle }: CreateCommentButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 h-auto flex flex-col items-center space-y-1"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="text-sm">Please Tell Us<br />About Your Vote</span>
      </Button>

      <CommentPopupDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default CreateCommentButton;
