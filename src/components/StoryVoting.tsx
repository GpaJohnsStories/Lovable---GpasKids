
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StoryVotingProps {
  storyId: string;
  thumbsUpCount: number;
  thumbsDownCount: number;
  okCount: number;
  currentVote: 'thumbs_up' | 'thumbs_down' | 'ok' | null;
  onVoteUpdate: (newCounts: { thumbs_up_count: number; thumbs_down_count: number; ok_count: number }, newVote: 'thumbs_up' | 'thumbs_down' | 'ok' | null) => void;
}

const StoryVoting = ({ storyId, thumbsUpCount, thumbsDownCount, okCount, currentVote, onVoteUpdate }: StoryVotingProps) => {
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
    const baseClass = "flex flex-col items-center space-y-1 h-auto py-3 px-4 transition-all duration-300";
    
    if (voteType === 'thumbs_up') {
      return `${baseClass} bg-green-500 hover:bg-green-600 text-white`;
    } else if (voteType === 'thumbs_down') {
      return `${baseClass} bg-red-500 hover:bg-red-600 text-white`;
    } else {
      return `${baseClass} bg-yellow-500 hover:bg-yellow-600 text-white`;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-amber-50 rounded-lg border border-amber-200">
      <h3 className="text-lg font-semibold text-orange-800 mb-2">How did you like this story?</h3>
      
      <div className="flex space-x-4">
        <Button
          onClick={() => handleVote('thumbs_up')}
          disabled={isVoting}
          className={getButtonClass('thumbs_up')}
        >
          <ThumbsUp className="h-6 w-6" />
          <span className="text-sm">Thumbs Up</span>
          <span className="text-xs">({thumbsUpCount})</span>
        </Button>

        <Button
          onClick={() => handleVote('ok')}
          disabled={isVoting}
          className={getButtonClass('ok')}
        >
          <span className="text-2xl">—</span>
          <span className="text-sm">OK</span>
          <span className="text-xs">({okCount})</span>
        </Button>

        <Button
          onClick={() => handleVote('thumbs_down')}
          disabled={isVoting}
          className={getButtonClass('thumbs_down')}
        >
          <ThumbsDown className="h-6 w-6" />
          <span className="text-sm">Thumbs Down</span>
          <span className="text-xs">({thumbsDownCount})</span>
        </Button>
      </div>
    </div>
  );
};

export default StoryVoting;
