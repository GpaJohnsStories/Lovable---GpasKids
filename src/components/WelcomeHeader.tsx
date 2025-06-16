
import { Link, useLocation } from "react-router-dom";
import { Home, Book, MessageSquare, Eye, Globe } from "lucide-react";

const WelcomeHeader = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-gradient-to-r from-amber-100 to-orange-200 border-b-4 border-orange-300 shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4">
          <Link to="/" className="group">
            <h1 className="text-4xl font-bold text-orange-800 text-center leading-tight group-hover:text-orange-900 transition-colors">
              📚 Buddy's Story Collection 📚
            </h1>
          </Link>
          
          <nav className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                isActive("/")
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white/70 text-orange-700 hover:bg-orange-100 hover:shadow-sm"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/library"
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                isActive("/library")
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white/70 text-orange-700 hover:bg-orange-100 hover:shadow-sm"
              }`}
            >
              <Book className="h-4 w-4" />
              <span>Library</span>
            </Link>

            <Link
              to="/map"
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                isActive("/map")
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white/70 text-orange-700 hover:bg-orange-100 hover:shadow-sm"
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>Map</span>
            </Link>
            
            <Link
              to="/make-comment"
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                isActive("/make-comment")
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white/70 text-orange-700 hover:bg-orange-100 hover:shadow-sm"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Comments</span>
            </Link>
            
            <Link
              to="/view-comments"
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                isActive("/view-comments")
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white/70 text-orange-700 hover:bg-orange-100 hover:shadow-sm"
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>View Comments</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default WelcomeHeader;
