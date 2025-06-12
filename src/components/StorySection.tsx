import { Button } from "@/components/ui/button";
import { BookOpen, Star, Heart, Globe, Smile } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import StoryCard from "./StoryCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
    // Include the newest real story if available
    ...(realStories.length > 0 ? [{
      id: parseInt(realStories[0].id.replace(/-/g, '').substring(0, 8), 16), // Convert UUID to number for compatibility
      title: realStories[0].title,
      description: realStories[0].excerpt || realStories[0].tagline || "A wonderful story waiting to be discovered.",
      readTime: "5 min read",
      illustration: "📖",
      category: realStories[0].category,
      author: realStories[0].author
    }] : []),
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

  const getCategoryHeader = (category: string) => {
    switch (category) {
      case "World Changers":
        return (
          <div className="flex items-center justify-center mb-6">
            <Globe className="h-6 w-6 text-orange-600 mr-3" />
            <div className="text-center">
              <h3 className="text-xl font-bold text-orange-800 font-fun">World Changers — Real People Who Made A Difference</h3>
            </div>
          </div>
        );
      case "Life":
        return (
          <div className="flex items-center justify-center mb-6">
            <Avatar className="h-6 w-6 mr-3">
              <AvatarImage src="/lovable-uploads/86bd5c48-6f8e-4a52-a343-273bf88f31cd.png" alt="Author" />
              <AvatarFallback>👤</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-bold text-orange-800 font-fun">Life — Lessons and Stories From My Life</h3>
            </div>
          </div>
        );
      case "Fun":
        return (
          <div className="flex items-center justify-center mb-6">
            <Smile className="h-6 w-6 text-orange-600 mr-3" />
            <div className="text-center">
              <h3 className="text-xl font-bold text-orange-800 font-fun">Fun</h3>
              <p className="text-sm text-orange-600 font-fun">Jokes, Poems, Games</p>
            </div>
          </div>
        );
      case "North Pole":
        return (
          <div className="flex items-center justify-center mb-6">
            <img src="/lovable-uploads/a63d1701-488c-49db-a1d3-5cb2b39f023d.png" alt="North Pole" className="h-6 w-6 mr-3" />
            <div className="text-center">
              <h3 className="text-xl font-bold text-orange-800 font-fun">North Pole</h3>
              <p className="text-sm text-orange-600 font-fun">Stories from the North Pole</p>
            </div>
          </div>
        );
      case "Newest":
        return (
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-orange-800 font-fun">Newest</h3>
          </div>
        );
      case "Most Popular":
        return (
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-orange-800 font-fun">Most Popular</h3>
          </div>
        );
      default:
        return (
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-orange-800 font-fun">{category}</h3>
          </div>
        );
    }
  };

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-orange-800 font-serif mb-4">Story Collection</h2>
        <p className="text-lg text-orange-700 max-w-2xl mx-auto leading-relaxed">
          Each story is crafted with love and designed to spark imagination, teach gentle lessons, 
          and create those precious bedtime moments you'll treasure forever.
        </p>
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
