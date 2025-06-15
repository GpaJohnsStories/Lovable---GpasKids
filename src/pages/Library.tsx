
import WelcomeHeader from "@/components/WelcomeHeader";
import StorySection from "@/components/StorySection";
import CookieFreeFooter from "@/components/CookieFreeFooter";

const Library = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      
      <main className="container mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-4" style={{ fontFamily: "'Kalam', 'Caveat', cursive, sans-serif" }}>
            Story Library
          </h1>
          <p className="text-orange-600 text-lg">
            Discover all of Grandpa John's wonderful stories in one place
          </p>
        </div>
        <StorySection />
      </main>
      <CookieFreeFooter />
    </div>
  );
};

export default Library;
