
import { Button } from "@/components/ui/button";
import StoryCard from "./StoryCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getCategoryHeader } from "@/utils/storySectionUtils";

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

  const newestStories = [
    // Include the newest real stories if available - using actual UUIDs
    ...(realStories.slice(0, 1).map(story => ({
      id: story.id, // Use the actual UUID
      title: story.title,
      description: story.excerpt || story.tagline || "A wonderful story waiting to be discovered.",
      readTime: "5 min read",
      illustration: "📖",
      category: story.category,
      author: story.author,
      photo_link_1: story.photo_link_1,
      photo_link_2: story.photo_link_2,
      photo_link_3: story.photo_link_3
    }))),
    {
      id: 6,
      title: "Grandpa's Old Toolbox",
      description: "Sometimes the most valuable treasures are the lessons hidden in everyday things.",
      readTime: "6 min read",
      illustration: "🧰",
      category: "Life",
      author: "Michael Chen"
    },
    {
      id: 7,
      title: "The Christmas Star",
      description: "How one little star found its way to guide everyone home for the holidays.",
      readTime: "5 min read",
      illustration: "⭐",
      category: "North Pole",
      author: "Sarah Williams"
    },
    {
      id: 8,
      title: "The Little Teacher",
      description: "Meet Rosa Parks through the eyes of a child who witnessed history in the making.",
      readTime: "7 min read",
      illustration: "🚌",
      category: "World Changers",
      author: "David Rodriguez"
    }
  ].slice(0, 4); // Ensure we only show 4 stories

  const popularStories = [
    {
      id: 9,
      title: "The Giggling Cookies",
      description: "What happens when cookies come to life and decide they don't want to be eaten?",
      readTime: "3 min read",
      illustration: "🍪",
      category: "Fun",
      author: "Lisa Park"
    },
    {
      id: 10,
      title: "The Day I Lost My Voice",
      description: "How I learned that sometimes listening is more powerful than speaking.",
      readTime: "8 min read",
      illustration: "🤐",
      category: "Life",
      author: "James Foster"
    },
    {
      id: 11,
      title: "Santa's Secret Helper",
      description: "Meet Pip, the elf who almost saved Christmas with just a paper clip and determination.",
      readTime: "6 min read",
      illustration: "🎅",
      category: "North Pole",
      author: "Maria Garcia"
    },
    {
      id: 12,
      title: "The Boy Who Planted Hope",
      description: "Learn about Wangari Maathai through the story of a boy inspired by her tree-planting mission.",
      readTime: "9 min read",
      illustration: "🌱",
      category: "World Changers",
      author: "Robert Kim"
    }
  ];

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-orange-800 mb-4" style={{ fontFamily: "'Kalam', 'Caveat', cursive, sans-serif" }}>Story Collection</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Newest Stories Column */}
        <div>
          {getCategoryHeader("Newest")}
          <div className="space-y-4">
            {newestStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>

        {/* Most Popular Stories Column */}
        <div>
          {getCategoryHeader("Most Popular")}
          <div className="space-y-4">
            {popularStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button className="cozy-button text-lg px-8 py-4">
          Now Begin <em>Your</em> Adventure
        </Button>
        <p className="text-orange-600 mt-4 text-sm">
          More magical stories are being added every week!
        </p>
      </div>
    </section>
  );
};

export default StorySection;
