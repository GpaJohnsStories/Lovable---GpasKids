
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { getCategoryButtonForStory } from "@/utils/storySectionUtils";
import { StoryData } from "@/utils/storiesData";
import { calculateReadingTime } from "@/utils/readingTimeUtils";
import AuthorLink from "@/components/AuthorLink";

interface StoryCardProps {
  story: StoryData;
}

const StoryCard = ({ story }: StoryCardProps) => {
  const getFirstAvailablePhoto = (): string | undefined => {
    return story.photo_link_1 || story.photo_link_2 || story.photo_link_3;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const firstPhoto = getFirstAvailablePhoto();

  return (
    <div className="w-full max-w-md mx-auto">
      <Link to={`/story/${story.id}`} onClick={scrollToTop}>
        <Card className="story-card group cursor-pointer hover:shadow-lg transition-shadow relative border-2 border-amber-300" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <CardContent className="p-3 text-center relative">
            <div className="mb-2">
              {getCategoryButtonForStory(story.category, story.id)}
            </div>
            
            <div className="flex items-center justify-center mb-2">
              {firstPhoto && (
                <div className="flex-shrink-0 mr-3">
                  <img 
                    src={firstPhoto} 
                    alt={`${story.title} thumbnail`}
                    className="w-16 h-16 object-cover rounded border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-base font-bold text-amber-800 mb-1 leading-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {story.title}
                </h3>
                {story.tagline && (
                  <h4 className="text-sm font-medium text-amber-700 mb-1 italic leading-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {story.tagline}
                  </h4>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-center text-sm text-amber-600 mb-2">
              <span className="font-medium mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>by {story.author}</span>
              <AuthorLink authorName={story.author} size="sm" />
            </div>

            <div className="flex items-center justify-center text-xs text-amber-600 mb-2">
              <span className="font-medium" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Story Code: {story.story_code}</span>
            </div>
            
            <p className="text-amber-700 mb-2 leading-relaxed text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
              {story.description}
            </p>
            
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default StoryCard;
