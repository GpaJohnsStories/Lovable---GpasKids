import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Volume2 } from "lucide-react";

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

const getCategoryStyles = (category: string) => {
  switch (category) {
    case "Fun":
      return "bg-blue-500 text-white";
    case "Life":
      return "bg-green-500 text-white";
    case "North Pole":
      return "bg-red-600 text-white";
    case "World Changers":
      return "bg-amber-400 text-amber-900";
    default:
      return "bg-amber-200 text-amber-800";
  }
};

const StoryCard = ({ story }: StoryCardProps) => {
  return (
    <Card className="story-card group cursor-pointer">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <div className="text-6xl mb-3">{story.illustration}</div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryStyles(story.category)}`}>
            {story.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-amber-800 mb-3 leading-relaxed">
          {story.title}
        </h3>
        
        <p className="text-amber-700 mb-4 leading-relaxed">
          {story.description}
        </p>
        
        <div className="flex items-center justify-end text-sm text-amber-600 mb-4">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            {story.readTime}
          </div>
        </div>
        
        <Button className="w-full cozy-button group-hover:shadow-lg">
          <Volume2 className="mr-2 h-4 w-4" />
          Read it to me
        </Button>
      </CardContent>
    </Card>
  );
};

export default StoryCard;
