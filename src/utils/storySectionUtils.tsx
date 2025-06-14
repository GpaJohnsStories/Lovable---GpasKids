
import { Globe, Smile } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const getCategoryHeader = (category: string) => {
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
