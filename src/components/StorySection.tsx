import { Button } from "@/components/ui/button";
import StoryCard from "./StoryCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
const StorySection = () => {
  const {
    data: realStories = [],
    error: queryError,
    isLoading
  } = useQuery({
    queryKey: ['stories', 'published'],
    queryFn: async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('stories').select('*').eq('published', 'Y').order('updated_at', {
          ascending: false
        });
        if (error) {
          console.error('📚 StorySection: Database error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }

        // Filter stories based on visitor's local time
        const now = new Date();
        const filteredStories = (data || []).filter(story => {
          const storyDate = new Date(story.updated_at);
          return storyDate <= now;
        });
        return filteredStories;
      } catch (err) {
        console.error('📚 StorySection: Query failed:', err);
        throw err;
      }
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000,
    refetchOnWindowFocus: false
  });

  // Get the most read story (highest read_count)
  const mostReadStory = realStories.length > 0 ? realStories.reduce((prev, current) => prev.read_count > current.read_count ? prev : current) : null;

  // Get the most popular story (highest thumbs_up_count)
  let mostPopularStory = realStories.length > 0 ? realStories.reduce((prev, current) => prev.thumbs_up_count > current.thumbs_up_count ? prev : current) : null;
  
  // If most popular is the same as most read, get the next most popular
  if (mostPopularStory && mostReadStory && mostPopularStory.id === mostReadStory.id) {
    const remainingStories = realStories.filter(story => story.id !== mostReadStory.id);
    mostPopularStory = remainingStories.length > 0 ? remainingStories.reduce((prev, current) => prev.thumbs_up_count > current.thumbs_up_count ? prev : current) : null;
  }

  // Convert to StoryData format
  const convertToStoryData = (story: any) => ({
    id: story.id,
    title: story.title,
    description: story.excerpt || story.tagline || "A wonderful story waiting to be discovered.",
    readTime: "5 min read",
    illustration: "📖",
    category: story.category,
    author: story.author,
    published: story.published,
    photo_link_1: story.photo_link_1,
    photo_link_2: story.photo_link_2,
    photo_link_3: story.photo_link_3,
    content: story.content,
    tagline: story.tagline,
    story_code: story.story_code,
    excerpt: story.excerpt,
    thumbs_up_count: story.thumbs_up_count,
    thumbs_down_count: story.thumbs_down_count,
    ok_count: story.ok_count,
    read_count: story.read_count
  });
  
  const featuredStories = [];
  if (mostReadStory) featuredStories.push({
    ...convertToStoryData(mostReadStory),
    category: 'Most Read Story'
  });
  if (mostPopularStory) featuredStories.push({
    ...convertToStoryData(mostPopularStory),
    category: 'Most Popular Story'
  });
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle loading state
  if (isLoading) {
    return <section className="py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading stories...</p>
        </div>
      </section>;
  }

  // Handle error state with friendly message
  if (queryError) {
    return <section className="py-16">
        <div className="text-center mb-12">
          <p className="text-amber-700 text-lg">Unable to load stories at the moment.</p>
          <p className="text-amber-600 text-sm mt-2">Please refresh the page or try again later.</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
            Try Again
          </button>
        </div>
        <div className="text-center">
          <Link to="/library" onClick={scrollToTop}>
            <Button className="cozy-button text-lg px-8 py-4">
              Browse Stories Library Instead
            </Button>
          </Link>
        </div>
      </section>;
  }
  return <section className="pt-4 pb-16">
      {featuredStories.length > 0 ? <div className="mb-12">
          {/* Featured Stories Section */}
          <div className="flex flex-col md:flex-row md:justify-between md:gap-6 space-y-8 md:space-y-0">
            {featuredStories.map(story => <div key={story.id}>
                <StoryCard story={story} />
              </div>)}
          </div>
        </div> : <div className="text-center mb-12">
          <p className="text-amber-700 text-lg">No published stories available at the moment.</p>
          <p className="text-amber-600 text-sm mt-2">Please check back soon for new stories!</p>
        </div>}

      <div className="text-center">
        <div className="flex justify-center">
          <Link to="/library" onClick={scrollToTop}>
            <Button className="bg-gradient-to-b from-orange-400 to-orange-600 text-white border-orange-700 h3-fun-24 px-8 py-4 h-auto min-h-11 rounded-full shadow-[0_6px_12px_rgba(194,65,12,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] border hover:shadow-[0_8px_16px_rgba(194,65,12,0.4),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200 whitespace-normal text-center">
              Click to Begin <em>Your</em> Adventure in Reading
            </Button>
          </Link>
        </div>
        <p className="text-blue-800 mt-4 text-center font-kalam font-semibold text-21px">
          I hope you will return here often, as I add new stories whenever I can.   <span className="text-xl text-blue-800 font-bold italic font-kalam">Gpa John</span>
        </p>
      </div>
    </section>;
};
export default StorySection;