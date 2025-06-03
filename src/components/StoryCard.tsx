
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, User } from "lucide-react";

interface Story {
  id: number;
  title: string;
  description: string;
  readTime: string;
  illustration: string;
  category: string;
}

interface StoryCardProps {
  story: Story;
}

const StoryCard = ({ story }: StoryCardProps) => {
  return (
    <Card className="story-card group cursor-pointer">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <div className="text-6xl mb-3">{story.illustration}</div>
          <span className="inline-block bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
            {story.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-amber-800 mb-3 leading-relaxed">
          {story.title}
        </h3>
        
        <p className="text-amber-700 mb-4 leading-relaxed">
          {story.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-amber-600 mb-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            Grandpa
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            {story.readTime}
          </div>
        </div>
        
        <Button className="w-full cozy-button group-hover:shadow-lg">
          <BookOpen className="mr-2 h-4 w-4" />
          Read This Story
        </Button>
      </CardContent>
    </Card>
  );
};

export default StoryCard;
