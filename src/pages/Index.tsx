
import WelcomeHeader from "@/components/WelcomeHeader";
import WelcomeText from "@/components/WelcomeText";
import StorySection from "@/components/StorySection";
import CookieFreeFooter from "@/components/CookieFreeFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      
      {/* GIF and Under Construction Box */}
      <div className="relative -mt-8 mb-2 flex justify-center items-center gap-8 z-20">
        {/* Under Construction Image */}
        <img 
          src="/lovable-uploads/3a1b5f78-6ca6-488d-90a3-369c6bc26b12.png"
          alt="Under Construction"
          className="w-40 h-40 object-contain"
        />
        
        {/* Dancing GIF with Speech Bubble */}
        <div className="relative">
          <img 
            src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExczNveHBjNDkxcDNwMG5mcHh2dmxvYXlucm4zZjF5a3BxaWRxb3VoNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cMALqIjmb7ygw/giphy.gif"
            alt="Fun dancing GIF"
            className="w-48 h-48 rounded-full border-4 border-white shadow-[inset_0_12px_20px_rgba(0,0,0,0.5),inset_0_6px_12px_rgba(0,0,0,0.3),inset_0_2px_6px_rgba(0,0,0,0.2)] object-cover"
          />
          {/* Speech Bubble Image */}
          <div className="absolute -right-28 top-4">
            <img 
              src="/lovable-uploads/e7798bd4-677c-4dbb-95aa-766cda36060b.png" 
              alt="Speech bubble saying HURRY UP!!! We want to read!!!"
              className="w-32 h-32 object-contain"
              onLoad={() => console.log('New speech bubble image loaded successfully')}
              onError={(e) => console.log('New speech bubble image failed to load:', e)}
            />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4" style={{ paddingTop: '0px' }}>
        <WelcomeText />
        <StorySection />
      </main>
      <CookieFreeFooter />
    </div>
  );
};

export default Index;
