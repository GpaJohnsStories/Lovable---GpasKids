
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, User } from "lucide-react";
import StoryCard from "./StoryCard";

const newestStories = [
  {
    id: 1,
    title: "The Magical Garden Behind Our House",
    description: "Come with me to discover the secret garden where flowers sing and butterflies tell jokes!",
    readTime: "5 minutes",
    illustration: "🌻",
    category: "Fun"
  },
  {
    id: 2,
    title: "When I Was Your Age: The Great Cookie Caper",
    description: "Let me tell you about the time your grandmother and I tried to bake cookies for the whole neighborhood...",
    readTime: "7 minutes",
    illustration: "🍪",
    category: "Life"
  },
  {
    id: 3,
    title: "The Friendly Dragon in the Attic",
    description: "Did I ever tell you about the tiny dragon who lived in our attic and helped us find lost socks?",
    readTime: "6 minutes",
    illustration: "🐉",
    category: "North Pole"
  },
  {
    id: 4,
    title: "The Day the Stars Fell Down",
    description: "A gentle story about the night when shooting stars brought wishes to everyone in our little town.",
    readTime: "8 minutes",
    illustration: "⭐",
    category: "World Changers"
  }
];

const popularStories = [
  {
    id: 5,
    title: "The Singing Teapot's Secret",
    description: "A funny tale about a teapot that could only sing opera and how it saved the day!",
    readTime: "4 minutes",
    illustration: "🫖",
    category: "Fun"
  },
  {
    id: 6,
    title: "The Lesson of the Lost Bicycle",
    description: "How losing my first bicycle taught me the most important lesson about honesty and friendship.",
    readTime: "6 minutes",
    illustration: "🚲",
    category: "Life"
  },
  {
    id: 7,
    title: "Santa's Helper Who Couldn't Wrap",
    description: "Meet Bumble, the elf who was terrible at wrapping presents but discovered his special gift.",
    readTime: "7 minutes",
    illustration: "🎁",
    category: "North Pole"
  },
  {
    id: 8,
    title: "The Little Girl Who Planted Hope",
    description: "The inspiring true story of a young girl who changed her whole community, one tree at a time.",
    readTime: "5 minutes",
    illustration: "🌳",
    category: "World Changers"
  }
];

const StorySection = () => {
  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-800 mb-3">
          Today's Stories from Grandpa
        </h2>
        <p className="text-lg text-amber-700 max-w-2xl mx-auto">
          Each story is specially chosen to make you smile, wonder, and feel the warm 
          feeling of being loved and safe.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Newest Stories Column */}
        <div>
          <h3 className="text-2xl font-bold text-amber-800 mb-6 text-center">Newest</h3>
          <div className="space-y-6">
            {newestStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>

        {/* Most Popular Stories Column */}
        <div>
          <h3 className="text-2xl font-bold text-amber-800 mb-6 text-center">Most Popular</h3>
          <div className="space-y-6">
            {popularStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-10">
        <Button variant="outline" size="lg" className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50">
          <BookOpen className="mr-2 h-5 w-5" />
          See All Stories
        </Button>
      </div>
    </section>
  );
};

export default StorySection;
