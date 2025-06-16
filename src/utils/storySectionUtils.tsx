import { Globe, Smile } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface Story {
  id: string | number;
  category: string;
}

interface CategoryButtonProps {
  children: React.ReactNode;
  linkTo: string;
}

const CategoryButton = ({ children, linkTo }: CategoryButtonProps) => (
  <Link to={linkTo}>
    <button className="bg-gradient-to-b from-amber-400 to-orange-600 text-white px-6 py-3 rounded-full font-semibold shadow-[0_6px_12px_rgba(194,65,12,0.3),0_3px_6px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] border border-orange-700 transition-all duration-200 hover:shadow-[0_8px_16px_rgba(194,65,12,0.4),0_4px_8px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1)] mb-6">
      {children}
    </button>
  </Link>
);

export const getCategoryHeader = (category: string, stories?: Story[]) => {
  // For "Newest" and "Most Popular", return titles with 3D banners
  if (category === "Newest") {
    return (
      <div className="flex items-center justify-center mb-6">
        <div className="w-[35%]">
          <div className="bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-xl h-20 shadow-[0_6px_0_#1e40af,0_8px_15px_rgba(0,0,0,0.3)] border border-blue-700 flex items-center justify-center">
            <h3 className="text-lg font-bold font-fun text-white text-center">Newest Stories in Each Category</h3>
          </div>
        </div>
      </div>
    );
  }

  if (category === "Most Popular") {
    return (
      <div className="flex items-center justify-center mb-6">
        <div className="w-[35%]">
          <div className="bg-gradient-to-b from-red-500 via-red-600 to-red-700 rounded-xl h-20 shadow-[0_6px_0_#b91c1c,0_8px_15px_rgba(0,0,0,0.3)] border border-red-800 flex items-center justify-center">
            <h3 className="text-lg font-bold font-fun text-white text-center">Most Popular Stories in Each Category</h3>
          </div>
        </div>
      </div>
    );
  }

  // Find a story from this category to link to
  const categoryStory = stories?.find(story => story.category === category);
  const linkTo = categoryStory ? `/story/${categoryStory.id}` : '#';

  const categoryConfig = {
    "World Changers": {
      icon: <Globe className="h-6 w-6 mr-3" />,
      title: "World Changers — Real People Who Made A Difference"
    },
    "Life": {
      icon: (
        <Avatar className="h-6 w-6 mr-3">
          <AvatarImage src="/lovable-uploads/86bd5c48-6f8e-4a52-a343-273bf88f31cd.png" alt="Author" />
          <AvatarFallback>👤</AvatarFallback>
        </Avatar>
      ),
      title: "Life — Lessons and Stories From My Life"
    },
    "Fun": {
      icon: <Smile className="h-6 w-6 mr-3" />,
      title: "Fun",
      subtitle: "Jokes, Poems, Games"
    },
    "North Pole": {
      icon: <img src="/lovable-uploads/a63d1701-488c-49db-a1d3-5cb2b39f023d.png" alt="North Pole" className="h-6 w-6 mr-3" />,
      title: "North Pole",
      subtitle: "Stories from the North Pole"
    }
  };

  const config = categoryConfig[category as keyof typeof categoryConfig];

  if (config) {
    return (
      <div className="flex items-center justify-center">
        <CategoryButton linkTo={linkTo}>
          <div className="flex items-center">
            {config.icon}
            <div className="text-center">
              <h3 className="text-xl font-bold font-fun">{config.title}</h3>
              {'subtitle' in config && config.subtitle && <p className="text-sm font-fun">{config.subtitle}</p>}
            </div>
          </div>
        </CategoryButton>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <CategoryButton linkTo={linkTo}>
        <h3 className="text-xl font-bold font-fun">{category}</h3>
      </CategoryButton>
    </div>
  );
};

// Category button configurations for story cards
const categoryButtonConfig = {
  "World Changers": {
    className: "bg-amber-400 text-amber-900 border-amber-500",
    icon: <Globe className="h-3 w-3 mr-1" />
  },
  "Life": {
    className: "bg-green-500 text-white border-green-600",
    icon: (
      <Avatar className="h-3 w-3 mr-1">
        <AvatarImage src="/lovable-uploads/86bd5c48-6f8e-4a52-a343-273bf88f31cd.png" alt="Author" />
        <AvatarFallback>👤</AvatarFallback>
      </Avatar>
    )
  },
  "Fun": {
    className: "bg-blue-500 text-white border-blue-600",
    icon: <Smile className="h-3 w-3 mr-1" />
  },
  "North Pole": {
    className: "bg-red-600 text-white border-red-700",
    icon: <img src="/lovable-uploads/a63d1701-488c-49db-a1d3-5cb2b39f023d.png" alt="North Pole" className="h-3 w-3 mr-1" />
  }
};

export const getCategoryButtonForStory = (category: string, storyId: string | number) => {
  const config = categoryButtonConfig[category as keyof typeof categoryButtonConfig];
  
  const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold shadow-[0_3px_6px_rgba(194,65,12,0.3),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)] transition-all duration-200 hover:shadow-[0_4px_8px_rgba(194,65,12,0.4),0_3px_6px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 active:shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(0,0,0,0.1)]";
  
  const className = config ? `${config.className} ${baseClasses}` : `bg-gradient-to-b from-amber-400 to-orange-600 text-white border-orange-700 ${baseClasses}`;

  return (
    <Link to={`/story/${storyId}`}>
      <button className={className}>
        <div className="flex items-center">
          {config?.icon}
          <span>{category}</span>
        </div>
      </button>
    </Link>
  );
};
