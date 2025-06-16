
import StoryVoting from "./StoryVoting";
import CreateCommentButton from "./CreateCommentButton";

interface StoryVotingSectionProps {
  storyId: string;
  storyCode: string;
  storyTitle: string;
  thumbsUpCount: number;
  thumbsDownCount: number;
  okCount: number;
  currentVote: 'thumbs_up' | 'thumbs_down' | 'ok' | null;
  onVoteUpdate: (newCounts: { thumbs_up_count: number; thumbs_down_count: number; ok_count: number }, newVote: 'thumbs_up' | 'thumbs_down' | 'ok' | null) => void;
}

const StoryVotingSection = ({
  storyId,
  storyCode,
  storyTitle,
  thumbsUpCount,
  thumbsDownCount,
  okCount,
  currentVote,
  onVoteUpdate
}: StoryVotingSectionProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        <StoryVoting
          storyId={storyId}
          thumbsUpCount={thumbsUpCount}
          thumbsDownCount={thumbsDownCount}
          okCount={okCount}
          currentVote={currentVote}
          onVoteUpdate={onVoteUpdate}
        />
        <CreateCommentButton storyCode={storyCode} storyTitle={storyTitle} />
      </div>
    </div>
  );
};

export default StoryVotingSection;
