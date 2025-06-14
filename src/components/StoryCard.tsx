
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Volume2, Book, User, Globe } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface Story {
  id: string | number; // Support both UUID strings and numbers
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
  const renderCategoryBadge = () => {
    if (story.category === "Life") {
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getCategoryStyles(story.category)}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Lessons and Stories From Grandpa John's Life
        </span>
      );
    }

    if (story.category === "World Changers") {
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getCategoryStyles(story.category)}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          World Changers — Real People Who Made A Difference
        </span>
      );
    }

    if (story.category === "North Pole") {
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getCategoryStyles(story.category)}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Stories from the North Pole
        </span>
      );
    }

    if (story.category === "Fun") {
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getCategoryStyles(story.category)}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Fun Jokes, Poems, Games & More
        </span>
      );
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getCategoryStyles(story.category)}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {story.category}
      </span>
    );
  };

  return (
    <Link to={`/story/${story.id}`}>
      <Card className="story-card group cursor-pointer w-2/5 mx-auto hover:shadow-lg transition-shadow" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <CardContent className="p-3 text-center">
          <div className="mb-2">
            {renderCategoryBadge()}
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
  );
};

export default StoryCard;
