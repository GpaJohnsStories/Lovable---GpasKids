import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ScrollToTop from "@/components/ScrollToTop";
import { WebTextBox } from "@/components/WebTextBox";
import { supabase } from "@/integrations/supabase/client";

const HowTo = () => {
  // Helper function to get icon URL from Supabase storage
  const getIconUrl = (iconName: string) => {
    return supabase.storage.from('icons').getPublicUrl(iconName).data.publicUrl;
  };

  // Safe icon URL getter with fallback
  const getSafeIconUrl = (iconCode: string) => {
    return getIconUrl(`${iconCode}.jpg`);
  };

  // Configuration for webtext boxes
  const webtextBoxes = [
    {
      webtextCode: "SYS-G1A",
      icon: "ICO-N2K",
      borderColor: "#16a34a", // Fresh Green
      backgroundColor: "bg-green-600/20",
      title: "Getting Started"
    },
    {
      webtextCode: "SYS-G2A",
      icon: "ICO-HO2",
      borderColor: "#dc2626", // Red to match buddy's home roof
      backgroundColor: "bg-red-600/20",
      title: "Home Page"
    },
    {
      webtextCode: "SYS-G3A",
      icon: "ICO-BK1",
      borderColor: "#F97316", // Orange to match menu icons
      backgroundColor: "bg-orange-600/20",
      title: "Story Library"
    },
    {
      webtextCode: "SYS-G3B",
      icon: "ICO-BK1",
      borderColor: "#3b82f6", // Blue same as admin top banner
      backgroundColor: "bg-blue-600/20",
      title: "Read A Story"
    },
    {
      webtextCode: "SYS-G4A",
      icon: "ICO-HIC",
      borderColor: "#FFCBA4", // Peach - leave color alone
      backgroundColor: "bg-orange-300/20",
      title: "Comments List Page"
    },
    {
      webtextCode: "SYS-G4B",
      icon: "ICO-HIC",
      borderColor: "#E6A875", // Darker Peach - leave color alone
      backgroundColor: "bg-orange-400/20",
      title: "Write a Comment Page"
    },
    {
      webtextCode: "SYS-G5A",
      icon: "ICO-WRI",
      borderColor: "#F97316", // Orange to match menu icons
      backgroundColor: "bg-orange-600/20",
      title: "Writing"
    },
    {
      webtextCode: "SYS-G6A",
      icon: "ICO-INF",
      borderColor: "#60a5fa", // Light blue
      backgroundColor: "bg-blue-400/20",
      title: "About Us"
    },
    {
      webtextCode: "SYS-G7A",
      icon: "ICO-LKD",
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
          <div className="flex items-start justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-orange-800">
              Buddy's Guide to Gpa's Website
            </h1>
            <div className="bg-gradient-to-br from-green-600/80 to-green-700/60 backdrop-blur-sm rounded-lg p-2 flex flex-col items-center text-center w-16 h-16 sm:w-[5.5rem] sm:h-[5.5rem] md:w-[7rem] md:h-[7rem] min-w-16 sm:min-w-[5.5rem] md:min-w-[7rem] flex-shrink-0 shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)] border-2 border-green-600">
              <img 
                src={getSafeIconUrl("ICO-GU1")}
                alt="Guide icon"
                className="w-full h-12 sm:h-18 md:h-24 object-cover rounded-md"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src.endsWith('.jpg')) {
                    img.src = getIconUrl('ICO-GU1.png');
                  } else if (img.src.endsWith('.png')) {
                    img.src = getIconUrl('ICO-GU1.gif');
                  } else {
                    console.log('All fallback formats failed for ICO-GU1');
                  }
                }}
              />
            </div>
          </div>
          
          {/* Stack of WebText Boxes */}
          <div className="space-y-2 mb-1">
            {webtextBoxes.map((box, index) => (
              <WebTextBox
                key={index}
                webtextCode={box.webtextCode}
                icon={box.icon}
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