
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

const GrandpaNote = () => {
  return (
    <div className="mt-16 text-center">
      <Card className="bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-200 p-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <Heart className="h-8 w-8 text-orange-600 mr-3" />
          <h3 className="text-2xl font-bold text-orange-800 font-handwritten">A Note From Grandpa John</h3>
        </div>
        <p className="text-orange-700 text-lg leading-relaxed mb-4 font-handwritten">
          You know, in all my years, I've learned that the best stories aren't just read—they're felt. 
          Each tale I share with you carries a piece of my heart and a sprinkle of the wisdom 
          I've gathered along the way.
        </p>
        <p className="text-orange-700 text-lg leading-relaxed font-handwritten">
          This is your safe haven, a place where imagination runs free, 
          kindness fills every corner, and every story ends with a warm hug.
        </p>
      </Card>
    </div>
  );
};

export default GrandpaNote;
