import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Volume2, Book, User } from "lucide-react";

interface Story {
  id: number;
  title: string;
  description: string;
  readTime: string;
  illustration: string;
  category: string;
  author: string;
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
      <CardContent className="p-3">
        <div className="text-center mb-2">
          <div className="text-3xl mb-1">{story.illustration}</div>
          <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium font-fun ${getCategoryStyles(story.category)}`}>
            {story.category}
          </span>
        </div>
        
        <h3 className="text-base font-bold text-amber-800 mb-1 leading-tight">
          {story.title}
        </h3>
        
        <div className="flex items-center text-sm text-amber-600 mb-2">
          <User className="h-3 w-3 mr-1" />
          <span className="font-medium">by {story.author}</span>
        </div>
        
        <p className="text-amber-700 mb-2 leading-relaxed text-sm">
          {story.description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-green-600 cursor-pointer hover:text-green-700 font-bold">
              <Book className="h-3 w-3 mr-1" />
              Show me
            </div>
            <div className="flex items-center text-blue-600 cursor-pointer hover:text-blue-700 font-bold">
              <Volume2 className="h-3 w-3 mr-1" />
              Read it
            </div>
          </div>
          <div className="flex items-center text-amber-600 font-bold">
            <BookOpen className="h-3 w-3 mr-1" />
            {story.readTime}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoryCard;
