
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface CreateStoryCardProps {
  onCreateStory: () => void;
}

const CreateStoryCard = ({ onCreateStory }: CreateStoryCardProps) => {
  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <CardTitle className="text-xl text-black" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Create New Story
            </CardTitle>
            <Button onClick={onCreateStory} className="bg-green-500 hover:bg-green-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Story
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default CreateStoryCard;
