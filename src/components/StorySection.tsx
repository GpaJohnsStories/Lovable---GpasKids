
import { Button } from "@/components/ui/button";
import { BookOpen, Star, Heart } from "lucide-react";
import StoryCard from "./StoryCard";

const StorySection = () => {
  const stories = [
    {
      id: 1,
      title: "The Magical Forest Adventure",
      description: "Join little Emma as she discovers a hidden world where trees can talk and flowers sing lullabies.",
      readTime: "5 min read",
      difficulty: "Easy"
    },
    {
      id: 2,
      title: "The Brave Little Dragon",
      description: "Meet Spark, a tiny dragon who's afraid of fire, and learn how courage comes in all sizes.",
      readTime: "7 min read",
      difficulty: "Medium"
    },
    {
      id: 3,
      title: "The Wishing Well's Secret",
      description: "What happens when Sarah discovers that the old well in her backyard grants wishes in unexpected ways?",
      readTime: "6 min read",
      difficulty: "Easy"
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
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
