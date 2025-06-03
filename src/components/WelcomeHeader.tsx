
import { Home, BookOpen } from "lucide-react";

const WelcomeHeader = () => {
  return (
    <header className="bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg border-b-4 border-orange-300">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Personal Photo */}
            <div className="bg-white rounded-full p-1 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=80&h=80&fit=crop&crop=face" 
                alt="Grandpa"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-serif">Grandpa's Story Corner</h1>
              <p className="text-amber-100 text-sm font-medium">Where every story feels like coming home</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-white hover:text-amber-200 transition-colors font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              My Stories
            </a>
            <a href="#" className="text-white hover:text-amber-200 transition-colors font-medium">
              About Me
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default WelcomeHeader;
