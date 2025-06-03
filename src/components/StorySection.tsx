
import { Button } from "@/components/ui/button";
import { BookOpen, Star, Heart } from "lucide-react";
import StoryCard from "./StoryCard";

const StorySection = () => {
  const categoryStories = [
    {
      id: 1,
      title: "The Magical Forest Adventure",
      description: "Join little Emma as she discovers a hidden world where trees can talk and flowers sing lullabies.",
      readTime: "5 min read",
      illustration: "🌳",
      category: "Fun"
    },
    {
      id: 2,
      title: "The Brave Little Dragon",
      description: "Meet Spark, a tiny dragon who's afraid of fire, and learn how courage comes in all sizes.",
      readTime: "7 min read",
      illustration: "🐉",
      category: "Life"
    },
    {
      id: 3,
      title: "The Wishing Well's Secret",
      description: "What happens when Sarah discovers that the old well in her backyard grants wishes in unexpected ways?",
      readTime: "6 min read",
      illustration: "🏛️",
      category: "North Pole"
    },
    {
      id: 4,
      title: "The Kind Helper's Journey",
      description: "Follow Maya as she learns how small acts of kindness can change the world around her.",
      readTime: "8 min read",
      illustration: "⭐",
      category: "World Changers"
    }
  ];

  const newestStories = [
    {
      id: 5,
      title: "The Rainbow Bridge",
      description: "A colorful tale about friendship and the magic that connects us all.",
      readTime: "4 min read",
      illustration: "🌈",
      category: "Fun"
    },
    {
      id: 6,
      title: "Grandpa's Old Toolbox",
      description: "Sometimes the most valuable treasures are the lessons hidden in everyday things.",
      readTime: "6 min read",
      illustration: "🧰",
      category: "Life"
    },
    {
      id: 7,
      title: "The Christmas Star",
      description: "How one little star found its way to guide everyone home for the holidays.",
      readTime: "5 min read",
      illustration: "⭐",
      category: "North Pole"
    },
    {
      id: 8,
      title: "The Little Teacher",
      description: "Meet Rosa Parks through the eyes of a child who witnessed history in the making.",
      readTime: "7 min read",
      illustration: "🚌",
      category: "World Changers"
    }
  ];

  const popularStories = [
    {
      id: 9,
      title: "The Giggling Cookies",
      description: "What happens when cookies come to life and decide they don't want to be eaten?",
      readTime: "3 min read",
      illustration: "🍪",
      category: "Fun"
    },
    {
      id: 10,
      title: "The Day I Lost My Voice",
      description: "How I learned that sometimes listening is more powerful than speaking.",
      readTime: "8 min read",
      illustration: "🤐",
      category: "Life"
    },
    {
      id: 11,
      title: "Santa's Secret Helper",
      description: "Meet Pip, the elf who almost saved Christmas with just a paper clip and determination.",
      readTime: "6 min read",
      illustration: "🎅",
      category: "North Pole"
    },
    {
      id: 12,
      title: "The Boy Who Planted Hope",
      description: "Learn about Wangari Maathai through the story of a boy inspired by her tree-planting mission.",
      readTime: "9 min read",
      illustration: "🌱",
      category: "World Changers"
    }
  ];

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="h-8 w-8 text-orange-600 mr-3" />
          <h2 className="text-3xl font-bold text-orange-800 font-serif">Story Collection</h2>
          <Star className="h-8 w-8 text-orange-600 ml-3" />
        </div>
        <p className="text-lg text-orange-700 max-w-2xl mx-auto leading-relaxed">
          Each story is crafted with love and designed to spark imagination, teach gentle lessons, 
          and create those precious bedtime moments you'll treasure forever.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Category Stories Column */}
        <div>
          <h3 className="text-xl font-bold text-orange-800 mb-6 text-center">Story Categories</h3>
          <div className="space-y-6">
            {categoryStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>

        {/* Newest Stories Column */}
        <div>
          <h3 className="text-xl font-bold text-orange-800 mb-6 text-center">Newest</h3>
          <div className="space-y-6">
            {newestStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>

        {/* Most Popular Stories Column */}
        <div>
          <h3 className="text-xl font-bold text-orange-800 mb-6 text-center">Most Popular</h3>
          <div className="space-y-6">
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
