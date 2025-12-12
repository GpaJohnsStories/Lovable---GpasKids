import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StoryCard from "@/components/StoryCard";
import { StoryData } from "@/utils/storiesData";

const FeaturedStoriesGrid = () => {
  // Query 1: Most Read Story (highest read_count)
  const { data: mostReadStory } = useQuery({
    queryKey: ['story', 'most-read'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('site', 'KIDS')
        .in('publication_status_code', [0, 1])
        .not('category', 'in', '("WebText","BioText","Admin")')
        .order('read_count', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Query 2: Most Popular Story (highest thumbs_up_count)
  const { data: mostPopularStory } = useQuery({
    queryKey: ['story', 'most-popular'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('site', 'KIDS')
        .in('publication_status_code', [0, 1])
        .not('category', 'in', '("WebText","BioText","Admin")')
        .order('thumbs_up_count', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Query 3: 4 Newest Stories (by updated_at)
  const { data: newestStories = [] } = useQuery({
    queryKey: ['stories', 'newest'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('site', 'KIDS')
        .in('publication_status_code', [0, 1])
        .not('category', 'in', '("WebText","BioText","Admin")')
        .order('created_at', { ascending: false })
        .limit(2);
      
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Row 1: Newest Stories Label (full width) */}
      <div className="flex justify-center mb-3">
        <div className="text-21px font-fun font-bold text-center px-6 py-3 rounded-lg border-3"
             style={{ 
               border: '3px solid #16a34a', 
               backgroundColor: 'rgba(22, 163, 74, 0.2)',
               color: '#16a34a'
             }}>
          Newest Stories
        </div>
      </div>

      {/* Row 2: 2 Newest Stories side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {newestStories.map(story => (
          <StoryCard key={story.id} story={story as any} borderColor="#16a34a" showCategoryButton={false} />
        ))}
      </div>

      {/* Row 3 & 4: Most Read and Most Popular - Desktop 2-column, Mobile stacked */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Read Column */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-center">
            <div className="text-21px font-fun font-bold text-center px-6 py-3 rounded-lg border-3" 
                 style={{ 
                   border: '3px solid #3b82f6', 
                   backgroundColor: '#ADD8E6',
                   color: '#333333'
                 }}>
              Most Read Story
            </div>
          </div>
          {mostReadStory && (
            <StoryCard story={mostReadStory as any} borderColor="#3b82f6" showCategoryButton={false} />
          )}
        </div>

        {/* Most Popular Column */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-center">
            <div className="text-21px font-fun font-bold text-center px-6 py-3 rounded-lg border-3"
                 style={{ 
                   border: '3px solid #F97316', 
                   backgroundColor: 'rgba(249, 115, 22, 0.2)',
                   color: '#F97316'
                 }}>
              Most Popular Story
            </div>
          </div>
          {mostPopularStory && (
            <StoryCard story={mostPopularStory as any} borderColor="#F97316" showCategoryButton={false} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedStoriesGrid;
