
import { Globe, Smile } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface Story {
  id: string | number;
  category: string;
}

export const getCategoryHeader = (category: string, stories?: Story[]) => {
  // For "Newest" and "Most Popular", just return simple titles
  if (category === "Newest") {
    return (
      <div className="flex items-center justify-center mb-6">
        <h3 className="text-xl font-bold font-fun text-orange-800">{category}</h3>
      </div>
    );
  }

  if (category === "Most Popular") {
    return (
      <div className="flex items-center justify-center mb-6">
        <h3 className="text-xl font-bold font-fun text-orange-800">{category}</h3>
      </div>
    );
  }

  // Find a story from this category to link to
  const categoryStory = stories?.find(story => story.category === category);
  const linkTo = categoryStory ? `/story/${categoryStory.id}` : '#';

  const CategoryButton = ({ children }: { children: React.ReactNode }) => (
    <Link to={linkTo}>
      <button className="bg-gradient-to-b from-amber-400 to-orange-600 text-white px-6 py-3 rounded-full font-semibold shadow-[0_6px_12px_rgba(194,65,12,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] border border-orange-700 transition-all duration-200 hover:shadow-[0_8px_16px_rgba(194,65,12,0.4),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)] mb-6">
        {children}
      </button>
    </Link>
  );

  switch (category) {
    case "World Changers":
      return (
        <div className="flex items-center justify-center">
          <CategoryButton>
            <div className="flex items-center">
              <Globe className="h-6 w-6 mr-3" />
              <div className="text-center">
                <h3 className="text-xl font-bold font-fun">World Changers — Real People Who Made A Difference</h3>
              </div>
            </div>
          </CategoryButton>
        </div>
      );
    case "Life":
      return (
        <div className="flex items-center justify-center">
          <CategoryButton>
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-3">
                <AvatarImage src="/lovable-uploads/86bd5c48-6f8e-4a52-a343-273bf88f31cd.png" alt="Author" />
                <AvatarFallback>👤</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-bold font-fun">Life — Lessons and Stories From My Life</h3>
              </div>
            </div>
          </CategoryButton>
        </div>
      );
    case "Fun":
      return (
        <div className="flex items-center justify-center">
          <CategoryButton>
            <div className="flex items-center">
              <Smile className="h-6 w-6 mr-3" />
              <div className="text-center">
                <h3 className="text-xl font-bold font-fun">Fun</h3>
                <p className="text-sm font-fun">Jokes, Poems, Games</p>
              </div>
            </div>
          </CategoryButton>
        </div>
      );
    case "North Pole":
      return (
        <div className="flex items-center justify-center">
          <CategoryButton>
            <div className="flex items-center">
              <img src="/lovable-uploads/a63d1701-488c-49db-a1d3-5cb2b39f023d.png" alt="North Pole" className="h-6 w-6 mr-3" />
              <div className="text-center">
                <h3 className="text-xl font-bold font-fun">North Pole</h3>
                <p className="text-sm font-fun">Stories from the North Pole</p>
              </div>
            </div>
          </CategoryButton>
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center">
          <CategoryButton>
            <h3 className="text-xl font-bold font-fun">{category}</h3>
          </CategoryButton>
        </div>
      );
  }
};

// New function to create category buttons that link to specific stories
export const getCategoryButtonForStory = (category: string, storyId: string | number) => {
  switch (category) {
    case "World Changers":
      return (
        <Link to={`/story/${storyId}`}>
          <button className="bg-gradient-to-b from-sky-300 via-sky-400 to-sky-500 text-blue-950 px-3 py-1 rounded-full text-xs font-semibold shadow-[0_3px_6px_rgba(3,105,161,0.3),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] border border-sky-600 transition-all duration-200 hover:shadow-[0_4px_8px_rgba(3,105,161,0.4),0_3px_6px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 active:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(0,0,0,0.1)]">
            <div className="flex items-center">
              <Globe className="h-3 w-3 mr-1" />
              <span>World Changers</span>
            </div>
          </button>
        </Link>
      );
    case "Life":
      return (
        <Link to={`/story/${storyId}`}>
          <button className="bg-gradient-to-b from-[#C5E4F3] via-[#ADD8E6] to-[#8AC6D1] text-blue-900 px-3 py-1 rounded-full text-xs font-semibold shadow-[0_3px_6px_rgba(123,184,196,0.3),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] border border-[#7AB8C4] transition-all duration-200 hover:shadow-[0_4px_8px_rgba(123,184,196,0.4),0_3px_6px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 active:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(0,0,0,0.1)]">
            <div className="flex items-center">
              <Avatar className="h-3 w-3 mr-1">
                <AvatarImage src="/lovable-uploads/86bd5c48-6f8e-4a52-a343-273bf88f31cd.png" alt="Author" />
                <AvatarFallback>👤</AvatarFallback>
              </Avatar>
              <span>Life</span>
            </div>
          </button>
        </Link>
      );
    case "Fun":
      return (
        <Link to={`/story/${storyId}`}>
          <button className="bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 text-green-800 px-3 py-1 rounded-full text-xs font-semibold shadow-[0_3px_6px_rgba(202,138,4,0.3),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] border border-yellow-600 transition-all duration-200 hover:shadow-[0_4px_8px_rgba(202,138,4,0.4),0_3px_6px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 active:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(0,0,0,0.1)]">
            <div className="flex items-center">
              <Smile className="h-3 w-3 mr-1" />
              <span>Fun</span>
            </div>
          </button>
        </Link>
      );
    case "North Pole":
      return (
        <Link to={`/story/${storyId}`}>
          <button className="bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-semibold shadow-[0_3px_6px_rgba(202,138,4,0.3),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] border border-yellow-700 transition-all duration-200 hover:shadow-[0_4px_8px_rgba(202,138,4,0.4),0_3px_6px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 active:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(0,0,0,0.1)]">
            <div className="flex items-center">
              <img src="/lovable-uploads/a63d1701-488c-49db-a1d3-5cb2b39f023d.png" alt="North Pole" className="h-3 w-3 mr-1" />
              <span>North Pole</span>
            </div>
          </button>
        </Link>
      );
    default:
      return (
        <Link to={`/story/${storyId}`}>
          <button className="bg-gradient-to-b from-amber-400 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-[0_3px_6px_rgba(194,65,12,0.3),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] border border-orange-700 transition-all duration-200 hover:shadow-[0_4px_8px_rgba(194,65,12,0.4),0_3px_6px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 active:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(0,0,0,0.1)]">
            <span>{category}</span>
          </button>
        </Link>
      );
  }
};
