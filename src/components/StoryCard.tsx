
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, User } from "lucide-react";
import { Link } from "react-router-dom";
import { renderCategoryBadge } from "@/utils/categoryUtils";

interface Story {
  id: string | number;
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

const StoryCard = ({ story }: StoryCardProps) => {
  return (
    <div className="w-2/5 mx-auto">
      <Link to={`/story/${story.id}`}>
        <Card className="story-card group cursor-pointer hover:shadow-lg transition-shadow" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <CardContent className="p-3 text-center">
            <div className="mb-2">
              {renderCategoryBadge(story.category)}
            </div>
            
            <h3 className="text-base font-bold text-amber-800 mb-1 leading-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {story.title}
            </h3>
            
            <div className="flex items-center justify-center text-sm text-amber-600 mb-2">
              <User className="h-3 w-3 mr-1" />
              <span className="font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>by {story.author}</span>
            </div>
            
            <p className="text-amber-700 mb-2 leading-relaxed text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
              {story.description}
            </p>
            
            <div className="flex items-center justify-center text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <div className="flex items-center text-amber-600 font-bold">
                <BookOpen className="h-3 w-3 mr-1" />
                {story.readTime}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default StoryCard;
