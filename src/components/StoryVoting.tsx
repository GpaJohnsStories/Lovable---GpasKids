
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
  onVoteUpdate: (newCounts: { thumbs_up_count: number; thumbs_down_count: number; ok_count: number }) => void;
}

const StoryVoting = ({ storyId, thumbsUpCount, thumbsDownCount, okCount, onVoteUpdate }: StoryVotingProps) => {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (voteType: 'thumbs_up' | 'thumbs_down' | 'ok') => {
    if (isVoting) return;
    
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

      if (existingVote) {
        toast.error("You have already voted on this story");
        return;
      }

      // Record the vote
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

      // Update the story vote count
      const updateField = `${voteType}_count`;
      const { data: updatedStory, error: updateError } = await supabase
        .from('stories')
        .update({ 
          [updateField]: voteType === 'thumbs_up' ? thumbsUpCount + 1 :
                        voteType === 'thumbs_down' ? thumbsDownCount + 1 :
                        okCount + 1
        })
        .eq('id', storyId)
        .select('thumbs_up_count, thumbs_down_count, ok_count')
        .single();

      if (updateError) {
        console.error('Error updating vote count:', updateError);
        throw updateError;
      }

      onVoteUpdate(updatedStory);
      toast.success("Thank you for your vote!");

    } catch (error) {
      console.error('Error voting:', error);
      toast.error("Failed to record your vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-amber-50 rounded-lg border border-amber-200">
      <h3 className="text-lg font-semibold text-orange-800 mb-2">How did you like this story?</h3>
      
      <div className="flex space-x-4">
        <Button
          onClick={() => handleVote('thumbs_up')}
          disabled={isVoting}
          className="flex flex-col items-center space-y-1 h-auto py-3 px-4 bg-green-500 hover:bg-green-600 text-white"
        >
          <ThumbsUp className="h-6 w-6" />
          <span className="text-sm">Thumbs Up</span>
          <span className="text-xs">({thumbsUpCount})</span>
        </Button>

        <Button
          onClick={() => handleVote('ok')}
          disabled={isVoting}
          className="flex flex-col items-center space-y-1 h-auto py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          <span className="text-2xl">—</span>
          <span className="text-sm">OK</span>
          <span className="text-xs">({okCount})</span>
        </Button>

        <Button
          onClick={() => handleVote('thumbs_down')}
          disabled={isVoting}
          className="flex flex-col items-center space-y-1 h-auto py-3 px-4 bg-red-500 hover:bg-red-600 text-white"
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
