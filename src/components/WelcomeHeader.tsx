
import { Home, BookOpen } from "lucide-react";

const WelcomeHeader = () => {
  return (
    <header className="bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg border-b-4 border-orange-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-full p-2 shadow-md">
              <Home className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Grandpa's Story Corner</h1>
              <p className="text-amber-100 text-sm">Where every story feels like home</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-white hover:text-amber-200 transition-colors font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Stories
            </a>
            <a href="#" className="text-white hover:text-amber-200 transition-colors font-medium">
              About Grandpa
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default WelcomeHeader;
