
import { renderCategoryBadge } from "@/utils/categoryUtils";

interface StoryHeaderProps {
  title: string;
  category: string;
  author: string;
  createdAt: string;
  tagline?: string;
  storyCode?: string;
  showStoryCode?: boolean;
}

const StoryHeader = ({ title, category, author, createdAt, tagline, storyCode, showStoryCode = false }: StoryHeaderProps) => {
  return (
    <>
      <div className="text-center mb-6">
        {renderCategoryBadge(category)}
      </div>

      <h1 className="text-3xl font-bold text-orange-800 text-center mb-4 leading-tight">
        {title}
      </h1>

      <div className="flex items-center justify-center space-x-6 text-sm text-orange-600 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
        <div className="flex items-center">
          <span className="font-medium">by {author}</span>
        </div>
        {showStoryCode && storyCode ? (
          <div className="flex items-center">
            <span>Story Code: {storyCode}</span>
          </div>
        ) : (
          <div className="flex items-center">
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {tagline && (
        <p className="text-lg text-orange-700 text-center mb-6 italic" style={{ fontFamily: 'Georgia, serif' }}>
          {tagline}
        </p>
      )}
    </>
  );
};

export default StoryHeader;
