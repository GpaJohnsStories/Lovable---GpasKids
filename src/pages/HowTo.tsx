import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import ScrollToTop from "@/components/ScrollToTop";
import { WebTextBox } from "@/components/WebTextBox";

const HowTo = () => {
  // Configuration for webtext boxes
  const webtextBoxes = [
    {
      webtextCode: "SYS-K2N",
      icon: "ICO-N2K",
      borderColor: "#16a34a", // Fresh Green
      backgroundColor: "bg-green-600/20",
      title: "Getting Started"
    },
    {
      webtextCode: "",
      icon: "ICO-HOM",
      borderColor: "#F97316", // Vibrant Orange
      backgroundColor: "bg-orange-600/20",
      title: "Home Page"
    },
    {
      webtextCode: "SYS-HOME",
      icon: "ICO_BK1",
      borderColor: "#3b82f6", // Admin Menu Blue
      backgroundColor: "bg-blue-600/20",
      title: "Story Library"
    },
    {
      webtextCode: "SYS-STY",
      icon: "ICO_BK1",
      borderColor: "#9c441a", // Rust Orange
      backgroundColor: "bg-yellow-600/20",
      title: "Read A Story"
    },
    {
      webtextCode: "SYS-ABT",
      icon: "ICO-INF",
      borderColor: "#16a34a", // Fresh Green
      backgroundColor: "bg-green-600/20",
      title: "About Us"
    },
    {
      webtextCode: "SYS-COM",
      icon: "ICO-HIC",
      borderColor: "#FFCBA4", // Peach
      backgroundColor: "bg-orange-300/20",
      title: "Comments List Page"
    },
    {
      webtextCode: "SYS-MCO",
      icon: "ICO-HIC",
      borderColor: "#E6A875", // Darker Peach
      backgroundColor: "bg-orange-400/20",
      title: "Write a Comment Page"
    },
    {
      webtextCode: "SYS-SEC",
      icon: "ICO-LKD",
      borderColor: "#4A7C59", // Forest Green
      backgroundColor: "bg-emerald-700/20",
      title: "We Are Safe!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-orange-800 mb-4">
            How To Use Gpa's Website for Kids
          </h1>
          
          {/* Stack of WebText Boxes */}
          <div className="space-y-2 mb-2">
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