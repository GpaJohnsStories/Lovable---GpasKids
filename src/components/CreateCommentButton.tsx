
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CreateCommentButtonProps {
  storyId: string;
  storyTitle: string;
}

const CreateCommentButton = ({ storyId, storyTitle }: CreateCommentButtonProps) => {
  const subject = `${storyId} - ${storyTitle}`;
  const encodedSubject = encodeURIComponent(subject);

  return (
    <Link to={`/make-comment?subject=${encodedSubject}`}>
      <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 h-auto flex flex-col items-center space-y-1">
        <MessageSquare className="h-6 w-6" />
        <span className="text-sm">Create Comment</span>
      </Button>
    </Link>
  );
};

export default CreateCommentButton;
