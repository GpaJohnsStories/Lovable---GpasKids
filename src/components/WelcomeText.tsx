
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const WelcomeText = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  console.log('WelcomeText - Current pathname:', location.pathname);
  console.log('WelcomeText - Is home page:', isHomePage);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <TooltipProvider>
      <div className="w-full py-6 mt-0">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl p-6 md:p-8 shadow-lg border-2 border-yellow-400 font-fun mx-2 relative" style={{backgroundColor: '#ADD8E6'}}>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative flex-shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <img 
                      src="/lovable-uploads/7877f657-a542-4479-a79d-5c919482ed36.png" 
                      alt="Gpa John & Buddy working together on new stories"
                      className="w-64 h-64 rounded-xl object-cover shadow-lg mx-auto md:mx-0 cursor-pointer"
                      onLoad={() => console.log('Image loaded successfully:', '/lovable-uploads/7877f657-a542-4479-a79d-5c919482ed36.png')}
                      onError={(e) => console.log('Image failed to load:', e)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-base font-serif text-blue-900 font-semibold">Gpa John & Buddy working together on new stories</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-col justify-center text-center md:text-left flex-1">
                {/* STORY_CODE:SYS-WEL:CONTENT */}
                <h1 className="text-3xl md:text-4xl font-bold text-blue-900 leading-relaxed mb-6">
                  Hi there!
                </h1>
                <p className="text-xl text-blue-900 font-semibold leading-relaxed max-w-3xl mx-auto md:mx-0 font-fun mb-6">
                  Buddy and I welcome you to our safe and fun corner of the internet. We've got stories, jokes, games, and lots of other cool stuff waiting for you. So come on in and have a fantastic time exploring every page!
                </p>
                
                {/* Note text moved inside the blue box */}
                <div className="space-y-2">
                  <p className="text-blue-800 italic font-fun text-lg">
                    Note: For best viewing and reading on your phone or tablet, use landscape mode.
                  </p>
                  <p className="text-blue-800 italic font-fun text-lg">
                    Please be sure to read our promise to you, click{' '}
                    <Link 
                      to="/privacy" 
                      onClick={scrollToTop}
                      className="text-blue-600 hover:text-blue-800 underline font-bold"
                    >
                      HERE
                    </Link>
                    {' '}or the Privacy button in the menu.
                  </p>
                </div>
                {/* END STORY_CODE:SYS-WEL:CONTENT */}
              </div>
            </div>
            
            {/* Web-text code in bottom right corner */}
            <div className="absolute bottom-4 right-4 text-sm font-mono text-blue-700 bg-white/70 px-2 py-1 rounded">
              SYS-WEL
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default WelcomeText;
