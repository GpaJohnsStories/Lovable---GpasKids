
import { Button } from "@/components/ui/button";
import StoryCard from "./StoryCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getCategoryHeader } from "@/utils/storySectionUtils";
import { Link } from "react-router-dom";
import { getNewestStories } from "@/utils/storiesData";

const StorySection = () => {
  const { data: realStories = [] } = useQuery({
    queryKey: ['stories', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('published', 'Y')
        .neq('category', 'System')
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching stories:', error);
        return [];
      }
      
      // Filter stories based on visitor's local time
      const now = new Date();
      const filteredStories = data.filter(story => {
        const storyDate = new Date(story.updated_at);
        return storyDate <= now;
      });
      
      return filteredStories;
    },
  });

  console.log('Fetched published stories:', realStories);

  // Get the most read story (highest read_count)
  const mostReadStory = realStories.length > 0 
    ? realStories.reduce((prev, current) => (prev.read_count > current.read_count) ? prev : current)
    : null;

  // Get the most popular story (highest thumbs_up_count)
  const mostPopularStory = realStories.length > 0 
    ? realStories.reduce((prev, current) => (prev.thumbs_up_count > current.thumbs_up_count) ? prev : current)
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
  if (mostReadStory) featuredStories.push({ ...convertToStoryData(mostReadStory), category: 'Most Read Stories' });
  if (mostPopularStory && mostPopularStory.id !== mostReadStory?.id) {
    featuredStories.push({ ...convertToStoryData(mostPopularStory), category: 'Most Popular Stories' });
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-16">
      {featuredStories.length > 0 ? (
        <div className="mb-12">
          {/* Featured Stories Section */}
          <div className="space-y-8">
            {featuredStories.map((story) => (
              <div key={story.id}>
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
          <Button className="cozy-button text-lg px-8 py-4">
            Click Here to Begin <em>Your</em> Adventure in Reading
          </Button>
        </Link>
        <p className="text-blue-800 mt-4 text-sm text-center" style={{ fontFamily: 'Kalam, "Comic Sans MS", "Apple Color Emoji", cursive' }}>
          I hope you will return here often as I try add new stories whenever I can.   <span className="text-sm text-blue-800 font-bold italic" style={{ fontFamily: 'Kalam, "Comic Sans MS", "Apple Color Emoji", cursive' }}>Gpa John</span>
        </p>
      </div>
    </section>
  );
};

export default StorySection;
