import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ScrollToTop from "@/components/ScrollToTop";
import { WebTextBox } from "@/components/WebTextBox";
import { supabase } from "@/integrations/supabase/client";

const Guide = () => {

  const webtextBoxes = [
    {
      webtextCode: "SYS-G1A",
      borderColor: "#16a34a", // Fresh Green
      backgroundColor: "bg-green-600/20",
      title: "Getting Started"
    },
    {
      webtextCode: "SYS-G2A",
      borderColor: "#dc2626", // Red to match buddy's home roof
      backgroundColor: "bg-red-600/20",
      title: "Home Page"
    },
    {
      webtextCode: "SYS-G3A",
      borderColor: "#F97316", // Orange to match menu icons
      backgroundColor: "bg-orange-600/20",
      title: "Story Library"
    },
    {
      webtextCode: "SYS-G3B",
      borderColor: "#3b82f6", // Blue same as admin top banner
      backgroundColor: "bg-blue-600/20",
      title: "Read A Story"
    },
    {
      webtextCode: "SYS-G4A",
      borderColor: "#FFCBA4", // Peach - leave color alone
      backgroundColor: "bg-orange-300/20",
      title: "Comments List Page"
    },
    {
      webtextCode: "SYS-G4B",
      borderColor: "#E6A875", // Darker Peach - leave color alone
      backgroundColor: "bg-orange-400/20",
      title: "Write a Comment Page"
    },
    {
      webtextCode: "SYS-G5A",
      borderColor: "#F97316", // Orange to match menu icons
      backgroundColor: "bg-orange-600/20",
      title: "Writing"
    },
    {
      webtextCode: "SYS-G6A",
      borderColor: "#60a5fa", // Light blue
      backgroundColor: "bg-blue-400/20",
      title: "About Us"
    },
    {
      webtextCode: "SYS-G7A",
      borderColor: "#4A7C59", // Forest Green - leave color alone
      backgroundColor: "bg-emerald-700/20",
      title: "We Are Safe!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-orange-800">
              Buddy's Guide to Gpa's Website
            </h1>
          </div>

          {/* Navigation Menu */}
          <div className="bg-gray-100 rounded-lg p-3 mb-6 shadow-sm">
            <div className="flex flex-wrap justify-center gap-1.5">
              <button 
                onClick={() => document.getElementById('SYS-G1A')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-20 h-16 px-1 py-1 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 active:from-green-700 active:to-green-800 text-white border-2 rounded-full text-sm font-bold transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight break-words shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
                style={{ borderColor: "#16a34a" }}
              >
                <span className="text-orange-800 text-base">Start</span>
                <span className="text-orange-800 text-base">Here</span>
              </button>
              <button 
                onClick={() => document.getElementById('SYS-G2A')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-20 h-16 px-1 py-1 bg-gradient-to-b from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 active:from-red-700 active:to-red-800 text-white border-2 border-red-600 rounded-full text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight break-words shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
                style={{ borderColor: "#dc2626" }}
              >
                <span className="text-orange-800 text-[10px]">Guide To</span>
                <span className="text-orange-800 text-[10px]">Home Page</span>
              </button>
              <button 
                onClick={() => document.getElementById('SYS-G3A')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-20 h-16 px-1 py-1 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 active:from-green-700 active:to-green-800 text-white border-2 border-green-600 rounded-full text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight break-words shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
                style={{ borderColor: "#16a34a" }}
              >
                <span className="text-[10px]">Guide To</span>
                <span className="text-[10px]">Story Library</span>
              </button>
              <button 
                onClick={() => document.getElementById('SYS-G3B')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-20 h-16 px-1 py-1 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 active:from-green-700 active:to-green-800 text-white border-2 border-green-600 rounded-full text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight break-words shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
                style={{ borderColor: "#16a34a" }}
              >
                <span className="text-[10px]">Guide To</span>
                <span className="text-[10px]">Read A Story</span>
              </button>
              <button 
                onClick={() => document.getElementById('SYS-G4A')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-20 h-16 px-1 py-1 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 active:from-green-700 active:to-green-800 text-white border-2 border-green-600 rounded-full text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight break-words shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
                style={{ borderColor: "#16a34a" }}
              >
                <span className="text-[10px]">Guide To</span>
                <span className="text-[10px]">Comments List</span>
              </button>
              <button 
                onClick={() => document.getElementById('SYS-G4B')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-20 h-16 px-1 py-1 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 active:from-green-700 active:to-green-800 text-white border-2 border-green-600 rounded-full text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight break-words shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
                style={{ borderColor: "#16a34a" }}
              >
                <span className="text-[10px]">Guide To</span>
                <span className="text-[10px]">Write Comment</span>
              </button>
              <button 
                onClick={() => document.getElementById('SYS-G5A')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-20 h-16 px-1 py-1 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 active:from-green-700 active:to-green-800 text-white border-2 border-green-600 rounded-full text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight break-words shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
                style={{ borderColor: "#16a34a" }}
              >
                <span className="text-[10px]">Guide To</span>
                <span className="text-[10px]">Write a Story</span>
              </button>
              <button 
                onClick={() => document.getElementById('SYS-G6A')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-20 h-16 px-1 py-1 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 active:from-green-700 active:to-green-800 text-white border-2 border-green-600 rounded-full text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight break-words shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
                style={{ borderColor: "#16a34a" }}
              >
                <span className="text-[10px]">Guide To</span>
                <span className="text-[10px]">About Us</span>
              </button>
              <button 
                onClick={() => document.getElementById('SYS-G7A')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-20 h-16 px-1 py-1 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 active:from-green-700 active:to-green-800 text-white border-2 border-green-600 rounded-full text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center text-center leading-tight break-words shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
                style={{ borderColor: "#16a34a" }}
              >
                <span className="text-[10px]">Guide To</span>
                <span className="text-[10px]">We Are Safe!</span>
              </button>
            </div>
          </div>
          
          {/* Stack of WebText Boxes */}
          <div className="space-y-2 mb-1">
            {webtextBoxes.map((box, index) => (
              <WebTextBox
                key={index}
                webtextCode={box.webtextCode}
                borderColor={box.borderColor}
                backgroundColor={box.backgroundColor}
                title={box.title}
                id={box.webtextCode}
              />
            ))}
          </div>
        </div>
      </main>

      <CookieFreeFooter />
      <ScrollToTop />
    </div>
  );
};

export default Guide;