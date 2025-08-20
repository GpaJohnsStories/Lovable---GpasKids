
import { Button } from "@/components/ui/button";
import StoryCard from "./StoryCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const StorySection = () => {
  const { data: realStories = [], error: queryError, isLoading } = useQuery({
    queryKey: ['stories', 'published'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .eq('published', 'Y')
          .order('updated_at', { ascending: false });
        
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
  const mostReadStory = realStories.length > 0 
    ? realStories.reduce((prev, current) => (prev.read_count > current.read_count) ? prev : current)
    : null;

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
    excerpt: story.excerpt
  });

  const featuredStories = [];
  if (mostReadStory) featuredStories.push({ ...convertToStoryData(mostReadStory), category: 'Most Read Story' });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle loading state
  if (isLoading) {
    return (
      <section className="py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading stories...</p>
        </div>
      </section>
    );
  }

  // Handle error state with friendly message
  if (queryError) {
    return (
      <section className="py-16">
        <div className="text-center mb-12">
          <p className="text-amber-700 text-lg">Unable to load stories at the moment.</p>
          <p className="text-amber-600 text-sm mt-2">Please refresh the page or try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
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
      </section>
    );
  }

  return (
    <section className="py-16">
      {featuredStories.length > 0 ? (
        <div className="mb-12">
          {/* Featured Stories Section */}
          <div className="flex flex-col lg:flex-row lg:gap-6 space-y-8 lg:space-y-0">
            {featuredStories.map((story) => (
              <div key={story.id} className="lg:flex-1">
                <div className="space-y-4">
                  <StoryCard story={story} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center mb-12">
          <p className="text-amber-700 text-lg">No published stories available at the moment.</p>
          <p className="text-amber-600 text-sm mt-2">Please check back soon for new stories!</p>
        </div>
      )}

      <div className="text-center">
        <Link to="/library" onClick={scrollToTop}>
          <Button className="cozy-button text-lg px-8 py-4 rounded-full">
            Click Here to Begin <em>Your</em> Adventure in Reading
          </Button>
        </Link>
        <p className="text-blue-800 mt-4 text-sm text-center font-kalam">
          I hope you will return here often as I try add new stories whenever I can.   <span className="text-sm text-blue-800 font-bold italic font-kalam">Gpa John</span>
        </p>
      </div>
    </section>
  );
};

export default StorySection;
