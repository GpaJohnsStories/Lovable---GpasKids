
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface StoryVotingProps {
  storyId: string;
  storyCode: string;
  storyTitle: string;
  thumbsUpCount: number;
  thumbsDownCount: number;
  okCount: number;
  currentVote: 'thumbs_up' | 'thumbs_down' | 'ok' | null;
  onVoteUpdate: (newCounts: { thumbs_up_count: number; thumbs_down_count: number; ok_count: number }, newVote: 'thumbs_up' | 'thumbs_down' | 'ok' | null) => void;
}

const StoryVoting = ({ 
  storyId, 
  storyCode, 
  storyTitle, 
  thumbsUpCount, 
  thumbsDownCount, 
  okCount, 
  currentVote, 
  onVoteUpdate 
}: StoryVotingProps) => {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (voteType: 'thumbs_up' | 'thumbs_down' | 'ok') => {
    if (isVoting) return;
    
    setIsVoting(true);
    
    try {
      // Simply record the new vote without any tracking
      const { error: voteError } = await supabase
        .from('story_votes')
        .insert({
          story_id: storyId,
          vote_type: voteType
        });

      if (voteError) {
        console.error('Error recording vote:', voteError);
        throw voteError;
      }

      // Calculate new counts
      const newCounts = {
        thumbs_up_count: voteType === 'thumbs_up' ? thumbsUpCount + 1 : thumbsUpCount,
        thumbs_down_count: voteType === 'thumbs_down' ? thumbsDownCount + 1 : thumbsDownCount,
        ok_count: voteType === 'ok' ? okCount + 1 : okCount
      };

      // Update the story vote count in database
      const { error: updateError } = await supabase
        .from('stories')
        .update(newCounts)
        .eq('id', storyId);

      if (updateError) {
        console.error('Error updating vote count:', updateError);
        throw updateError;
      }

      onVoteUpdate(newCounts, voteType);
      toast.success("Thank you for your vote!");

    } catch (error) {
      console.error('Error voting:', error);
      toast.error("Failed to record your vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const getButtonClass = (voteType: 'thumbs_up' | 'thumbs_down' | 'ok') => {
    const baseClass = "flex flex-col items-center justify-center space-y-1 h-24 w-24 transition-all duration-300 text-white";
    
    if (voteType === 'thumbs_up') {
      return `${baseClass} !bg-[hsl(var(--vote-thumbs-up))] hover:!bg-[hsl(var(--vote-thumbs-up-hover))]`;
    } else if (voteType === 'thumbs_down') {
      return `${baseClass} !bg-[hsl(var(--vote-thumbs-down))] hover:!bg-[hsl(var(--vote-thumbs-down-hover))]`;
    } else {
      return `${baseClass} !bg-[hsl(var(--vote-ok))] hover:!bg-[hsl(var(--vote-ok-hover))]`;
    }
  };

  const encodedStoryCode = encodeURIComponent(storyCode);

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-amber-50 rounded-lg border border-amber-200">
      <h3 className="text-lg font-semibold text-orange-800 mb-2">How did you like this story?</h3>
      
      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* Voting Buttons */}
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            onClick={() => handleVote('thumbs_up')}
            disabled={isVoting}
            className={getButtonClass('thumbs_up')}
          >
            <ThumbsUp className="h-5 w-5" />
            <span className="text-base leading-tight text-center italic font-bold">I Really<br />Liked It!</span>
            <span className="text-xs">({thumbsUpCount})</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleVote('ok')}
            disabled={isVoting}
            className={getButtonClass('ok')}
          >
            <div className="h-5 w-5"></div>
            <span className="text-base leading-tight text-center font-bold text-blue-600">It Was<br />Just Ok!</span>
            <span className="text-xs">({okCount})</span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => handleVote('thumbs_down')}
            disabled={isVoting}
            className={getButtonClass('thumbs_down')}
          >
            <ThumbsDown className="h-5 w-5" />
            <span className="text-base leading-tight text-center font-bold text-black">I Didn't<br />Like It!</span>
            <span className="text-xs">({thumbsDownCount})</span>
          </Button>
        </div>

        {/* Comment Button */}
        <Link to={`/make-comment?storyCode=${encodedStoryCode}`}>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white h-12 w-80 rounded-full flex items-center justify-center transition-all duration-300">
            <span className="text-xs leading-tight text-center font-bold">Please Tell Us About Your Vote</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default StoryVoting;
