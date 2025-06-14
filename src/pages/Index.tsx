
import WelcomeHeader from "@/components/WelcomeHeader";
import WelcomeText from "@/components/WelcomeText";
import StorySection from "@/components/StorySection";
import CookieFreeFooter from "@/components/CookieFreeFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      
      {/* GIF and Under Construction Box */}
      <div className="relative -mt-8 mb-4 flex justify-center items-center gap-8 z-20">
        {/* Under Construction Box */}
        <div 
          className="px-6 py-4 rounded-lg shadow-lg border-2 border-black font-bold text-black text-lg"
          style={{
            background: 'repeating-linear-gradient(45deg, #FFD700 0px, #FFD700 20px, #000000 20px, #000000 40px)',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          Under Construction
        </div>
        
        {/* Dancing GIF */}
        <img 
          src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExczNveHBjNDkxcDNwMG5mcHh2dmxvYXlucm4zZjF5a3BxaWRxb3VoNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cMALqIjmb7ygw/giphy.gif"
          alt="Fun dancing GIF"
          className="w-48 h-48 rounded-lg shadow-lg border-4 border-white"
        />
      </div>

      <main className="container mx-auto px-4 py-8">
        <WelcomeText />
        <StorySection />
      </main>
      <CookieFreeFooter />
    </div>
  );
};

export default Index;
