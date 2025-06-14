
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
                src="/lovable-uploads/d05b3b1c-686e-4f7b-9844-38a790c9b067.png" 
                alt="Grandpa's beloved companion"
                className="w-16 h-16 rounded-full object-cover object-top"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-handwritten">Grandpa John's Stories for Kids</h1>
              <p className="text-amber-100 text-sm font-medium">Where every story feels like a new adventure</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="/" className="text-white hover:text-amber-200 transition-colors font-medium flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </a>
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
