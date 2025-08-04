import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ScrollToTop from "@/components/ScrollToTop";
import { WebTextBox } from "@/components/WebTextBox";
import { supabase } from "@/integrations/supabase/client";

const HowTo = () => {

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
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-orange-800">
              Buddy's Guide to Gpa's Website
            </h1>
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

export default HowTo;