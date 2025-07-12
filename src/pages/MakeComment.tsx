import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import CommentForm from "@/components/CommentForm";
import ScrollToTop from "@/components/ScrollToTop";
import CommentsWelcome from "@/components/CommentsWelcome";
import CommentsRules from "@/components/CommentsRules";
import { useSearchParams } from "react-router-dom";

const MakeComment = () => {
  const [searchParams] = useSearchParams();
  const prefilledStoryCode = searchParams.get('storyCode') || '';

  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      <WelcomeHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <CommentsWelcome />
        <div className="mt-6">
          <CommentsRules />
        </div>
        <div className="mt-6">
          <CommentForm prefilledStoryCode={prefilledStoryCode} />
        </div>
      </main>
      <CookieFreeFooter />
      <ScrollToTop />
    </div>
  );
};

export default MakeComment;
