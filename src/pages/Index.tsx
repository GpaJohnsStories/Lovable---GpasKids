
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Heart, Home } from "lucide-react";
import StorySection from "@/components/StorySection";
import WelcomeHeader from "@/components/WelcomeHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <WelcomeHeader />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Personal Welcome Section */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-8 shadow-lg border-2 border-orange-200 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-4 leading-relaxed font-serif">
              Welcome to my special place for children to enjoy stories!
            </h1>
            <p className="text-xl text-amber-700 mb-6 leading-relaxed max-w-3xl mx-auto">
              With over 80 years of life experience and 10 wonderful grandchildren, I have many stories to share with you. 
              Each one comes straight from my heart, filled with wonder, laughter, and the kind of magic 
              that happens when we sit quietly with a good story.
            </p>
            <p className="text-lg text-amber-600 mb-6 leading-relaxed max-w-2xl mx-auto italic">
              "Every story I tell is a gift from my heart to yours. Come, let's create some magical memories together!"
            </p>
            <Button className="cozy-button text-lg">
              <BookOpen className="mr-2 h-5 w-5" />
              Let's Begin Our Adventure
            </Button>
          </div>
        </div>

        {/* Story Collection */}
        <StorySection />

        {/* Personal Message */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-200 p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-orange-600 mr-3" />
              <h3 className="text-2xl font-bold text-orange-800 font-serif">A Note From Grandpa</h3>
            </div>
            <p className="text-orange-700 text-lg leading-relaxed mb-4">
              You know, in all my years, I've learned that the best stories aren't just read—they're felt. 
              Each tale I share with you carries a piece of my heart and a sprinkle of the wisdom 
              I've gathered along the way.
            </p>
            <p className="text-orange-600 text-base leading-relaxed">
              This is your safe haven, dear one. A place where imagination runs free, 
              kindness fills every corner, and every story ends with a warm hug.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
