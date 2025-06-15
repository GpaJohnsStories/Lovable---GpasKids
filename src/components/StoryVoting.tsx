
import { useState, useEffect } from "react";
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
    
    // Prevent voting for the same option
    if (currentVote === voteType) {
      toast.error("You have already voted for this option");
      return;
    }
    
    setIsVoting(true);
    
    try {
      // Check if user has already voted from this IP
      const { data: existingVote, error: checkError } = await supabase
        .from('story_votes')
        .select('*')
        .eq('story_id', storyId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing vote:', checkError);
        throw checkError;
      }

      let newCounts = {
        thumbs_up_count: thumbsUpCount,
        thumbs_down_count: thumbsDownCount,
        ok_count: okCount
      };

      if (existingVote) {
        // User is changing their vote - update the existing vote
        const { error: updateError } = await supabase
          .from('story_votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);

        if (updateError) {
          console.error('Error updating vote:', updateError);
          throw updateError;
        }

        // Adjust counts: decrease old vote, increase new vote
        const oldVoteField = `${existingVote.vote_type}_count`;
        const newVoteField = `${voteType}_count`;
        
        newCounts = {
          thumbs_up_count: existingVote.vote_type === 'thumbs_up' ? thumbsUpCount - 1 : voteType === 'thumbs_up' ? thumbsUpCount + 1 : thumbsUpCount,
          thumbs_down_count: existingVote.vote_type === 'thumbs_down' ? thumbsDownCount - 1 : voteType === 'thumbs_down' ? thumbsDownCount + 1 : thumbsDownCount,
          ok_count: existingVote.vote_type === 'ok' ? okCount - 1 : voteType === 'ok' ? okCount + 1 : okCount
        };

        toast.success("Your vote has been updated!");
      } else {
        // Record the new vote
        const { error: voteError } = await supabase
          .from('story_votes')
          .insert({
            story_id: storyId,
            vote_type: voteType,
            ip_address: null, // Will be handled by RLS/server
            user_agent: navigator.userAgent
          });

        if (voteError) {
          console.error('Error recording vote:', voteError);
          throw voteError;
        }

        // Increase the vote count
        newCounts = {
          thumbs_up_count: voteType === 'thumbs_up' ? thumbsUpCount + 1 : thumbsUpCount,
          thumbs_down_count: voteType === 'thumbs_down' ? thumbsDownCount + 1 : thumbsDownCount,
          ok_count: voteType === 'ok' ? okCount + 1 : okCount
        };

        toast.success("Thank you for your vote!");
      }

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

    } catch (error) {
      console.error('Error voting:', error);
      toast.error("Failed to record your vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  const getButtonClass = (voteType: 'thumbs_up' | 'thumbs_down' | 'ok') => {
    const baseClass = "flex flex-col items-center space-y-1 h-auto py-3 px-4 transition-all duration-200";
    const isSelected = currentVote === voteType;
    
    if (voteType === 'thumbs_up') {
      return `${baseClass} ${isSelected ? 'bg-green-600 shadow-lg shadow-green-300 scale-105' : 'bg-green-500 hover:bg-green-600'} text-white`;
    } else if (voteType === 'thumbs_down') {
      return `${baseClass} ${isSelected ? 'bg-red-600 shadow-lg shadow-red-300 scale-105' : 'bg-red-500 hover:bg-red-600'} text-white`;
    } else {
      return `${baseClass} ${isSelected ? 'bg-yellow-600 shadow-lg shadow-yellow-300 scale-105' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`;
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
