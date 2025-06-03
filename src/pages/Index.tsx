
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
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-8 shadow-lg border-2 border-orange-200 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-4 leading-relaxed">
              Welcome to Grandpa's Story Corner! 📚
            </h1>
            <p className="text-xl text-amber-700 mb-6 leading-relaxed max-w-3xl mx-auto">
              Come sit by the fireplace and let me tell you the most wonderful stories! 
              Pull up a cozy chair, grab your favorite blanket, and let's begin our adventure together.
            </p>
            <Button className="cozy-button text-lg">
              <BookOpen className="mr-2 h-5 w-5" />
              Start Reading Stories
            </Button>
          </div>
        </div>

        {/* Story Collection */}
        <StorySection />

        {/* Safety Message */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200 p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-3">
              <Heart className="h-8 w-8 text-green-600 mr-2" />
              <h3 className="text-2xl font-bold text-green-800">Safe & Secure</h3>
            </div>
            <p className="text-green-700 text-lg leading-relaxed">
              This is your safe space for stories and learning. No ads, no strangers, 
              just wonderful tales and a cozy place to explore your imagination!
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
