
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CreateCommentButtonProps {
  storyCode: string;
  storyTitle: string;
}

const CreateCommentButton = ({ storyCode, storyTitle }: CreateCommentButtonProps) => {
  const encodedStoryCode = encodeURIComponent(storyCode);

  return (
    <Link to={`/make-comment?storyCode=${encodedStoryCode}`}>
      <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 h-auto flex flex-col items-center space-y-1">
        <MessageSquare className="h-6 w-6" />
        <span className="text-sm">Please Tell Us<br />About Your Vote</span>
      </Button>
    </Link>
  );
};

export default CreateCommentButton;
