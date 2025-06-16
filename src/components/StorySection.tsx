
import { Button } from "@/components/ui/button";
import StoryCard from "./StoryCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getCategoryHeader } from "@/utils/storySectionUtils";
import { Link } from "react-router-dom";
import { getNewestStories, getPopularStories } from "@/utils/storiesData";

const StorySection = () => {
  const { data: realStories = [] } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching stories:', error);
        return [];
      }
      
      return data;
    },
  });

  console.log('Fetched stories:', realStories);

  const newestStories = getNewestStories(realStories);
  const popularStories = getPopularStories();
  const allStories = [...newestStories, ...popularStories];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-16">
      {/* Colored Banner with Title and Menu Button */}
      <div className="w-[90%] mx-auto mb-12">
        <div className="bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700 rounded-xl p-6 shadow-[0_6px_0_#c2410c,0_8px_15px_rgba(0,0,0,0.3)] border border-orange-700">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold text-white font-fun">Today's Highlighted Stories</h2>
            <Link to="/library" onClick={scrollToTop}>
              <button className="bg-gradient-to-b from-orange-600 via-orange-700 to-orange-800 text-white px-4 py-2 rounded-lg font-semibold shadow-[0_4px_0_#9a3412,0_6px_12px_rgba(0,0,0,0.3)] border border-orange-800 transition-all duration-200 hover:shadow-[0_3px_0_#9a3412,0_4px_8px_rgba(0,0,0,0.4)] hover:translate-y-1 active:translate-y-2 active:shadow-[0_1px_0_#9a3412,0_2px_4px_rgba(0,0,0,0.3)] font-fun text-sm">
                Click Here to View Full Story List
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Newest Stories Column */}
        <div>
          {getCategoryHeader("Newest", allStories)}
          <div className="space-y-4">
            {newestStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>

        {/* Most Popular Stories Column */}
        <div>
          {getCategoryHeader("Most Popular", allStories)}
          <div className="space-y-4">
            {popularStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/library" onClick={scrollToTop}>
          <Button className="cozy-button text-lg px-8 py-4">
            Now Begin <em>Your</em> Adventure in Reading
          </Button>
        </Link>
        <p className="text-blue-800 mt-4 text-sm">
          I hope you will return here often as I try add new stories whenever I can.
        </p>
      </div>
    </section>
  );
};

export default StorySection;
