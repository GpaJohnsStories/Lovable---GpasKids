
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getCategoryButtonForStory } from "@/utils/storySectionUtils";
import { StoryData } from "@/utils/storiesData";

import AuthorLink from "@/components/AuthorLink";

interface StoryCardProps {
  story: StoryData;
  borderColor?: string;
  showCategoryButton?: boolean;
}

const StoryCard = ({ story, borderColor, showCategoryButton = true }: StoryCardProps) => {
  
  const getFirstAvailablePhoto = (): string | undefined => {
    return story.photo_link_1 || story.photo_link_2 || story.photo_link_3;
  };

  const handleClick = () => {
    // Open story in new tab
    window.open(`/story/${story.story_code}`, '_blank');
  };

  const firstPhoto = getFirstAvailablePhoto();

  const getBorderStyle = () => {
    if (borderColor) return `4px solid ${borderColor}`;
    if (story.category === 'Most Read Story') return '4px solid #3b82f6';
    if (story.category === 'Most Popular Story') return '4px solid #F97316';
    return '2px solid #fbbf24';
  };

  return (
    <div className="w-full max-w-md mx-auto md:mx-0 md:ml-0">
      <Card 
        className="story-card group cursor-pointer hover:shadow-lg transition-shadow relative font-system" 
        style={{ border: getBorderStyle() }}
        onClick={handleClick}
      >
        <CardContent className="p-3 relative">
          <div className="flex gap-3 mb-3">
            {firstPhoto && (
              <div className="flex-shrink-0">
                <img 
                  src={firstPhoto} 
                  alt={`${story.title} thumbnail`}
                  className="w-40 h-40 object-cover rounded border border-gray-400"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex-1 flex flex-col items-center min-h-40">
              {showCategoryButton && story.category !== 'Most Read Story' && story.category !== 'Most Popular Story' && (
                <div className="mb-2">
                  {getCategoryButtonForStory(story.category, story.story_code)}
                </div>
              )}
              <div className="mb-2">
                <div className="text-xs text-gray-600 font-medium">
                  👍 {story.thumbs_up_count || 0} | 👎 {story.thumbs_down_count || 0} | 😊 {story.ok_count || 0} | Reads: {(story.read_count || 0).toLocaleString()}
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <h3 className="h3-fun-24 font-bold text-amber-800 leading-tight text-center">
                  {story.title}
                </h3>
              </div>
            </div>
          </div>
          {story.tagline && (
            <div className="mb-0">
              <h4 className="text-21px text-amber-700 italic leading-tight font-fun text-center">
                {story.tagline}
              </h4>
            </div>
          )}
          
          <div className="flex flex-col items-center text-sm text-amber-600">
            <span className="text-21px font-medium font-fun text-amber-800">by {story.author}</span>
            <AuthorLink authorName={story.author} size="sm" />
          </div>

          <div className="absolute bottom-2 right-2 text-amber-600">
            <span className="text-18px font-medium font-fun">Story Code: {story.story_code}</span>
          </div>
          
          <p className="text-21px text-amber-700 mb-2 leading-relaxed font-fun">
            {story.excerpt || story.description}
          </p>
          
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryCard;
