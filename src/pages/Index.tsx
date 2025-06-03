
import WelcomeHeader from "@/components/WelcomeHeader";
import StorySection from "@/components/StorySection";
import CookieFreeFooter from "@/components/CookieFreeFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <WelcomeHeader />
      <StorySection />
      <CookieFreeFooter />
    </div>
  );
};

export default Index;
