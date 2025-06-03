
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, User } from "lucide-react";
import StoryCard from "./StoryCard";

const stories = [
  {
    id: 1,
    title: "The Magical Garden Behind Our House",
    description: "Come with me to discover the secret garden where flowers sing and butterflies tell jokes!",
    readTime: "5 minutes",
    illustration: "🌻",
    category: "Adventure"
  },
  {
    id: 2,
    title: "When I Was Your Age: The Great Cookie Caper",
    description: "Let me tell you about the time your grandmother and I tried to bake cookies for the whole neighborhood...",
    readTime: "7 minutes",
    illustration: "🍪",
    category: "Funny"
  },
  {
    id: 3,
    title: "The Friendly Dragon in the Attic",
    description: "Did I ever tell you about the tiny dragon who lived in our attic and helped us find lost socks?",
    readTime: "6 minutes",
    illustration: "🐉",
    category: "Fantasy"
  },
  {
    id: 4,
    title: "The Day the Stars Fell Down",
    description: "A gentle story about the night when shooting stars brought wishes to everyone in our little town.",
    readTime: "8 minutes",
    illustration: "⭐",
    category: "Wonder"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
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
