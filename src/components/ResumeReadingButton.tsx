import { useNavigate } from 'react-router-dom';
import { useLastReadStory } from '@/hooks/useLastReadStory';

const ResumeReadingButton = () => {
  const lastReadStory = useLastReadStory();
  const navigate = useNavigate();

  if (!lastReadStory) {
    return null;
  }

  const handleClick = () => {
    navigate(`/story/${lastReadStory.story_code}`);
  };

  return (
    <button
      onClick={handleClick}
      className="
        w-full sm:w-auto
        px-8 py-3
        rounded-full
        font-kalam text-21px font-bold
        text-white
        shadow-lg hover:shadow-xl
        transition-all duration-200
        hover:scale-105 active:scale-95
        min-h-[44px]
        touch-manipulation
      "
      style={{
        backgroundColor: '#9c441a',
        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
      }}
    >
      Read Current Story: {lastReadStory.title}, {lastReadStory.author}, {lastReadStory.story_code}
    </button>
  );
};

export default ResumeReadingButton;
