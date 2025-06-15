
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import CommentsList from "@/components/CommentsList";
import { useState } from "react";
import { getPersonalId } from "@/utils/personalId";
import { toast } from "sonner";

const ViewComments = () => {
  const [personalIdFilter, setPersonalIdFilter] = useState<string | null>(null);

  const handleShowMyComments = () => {
    const personalId = getPersonalId();
    if (personalId) {
      setPersonalIdFilter(personalId);
      toast.success(`Showing only comments for Personal ID: ${personalId}`);
    } else {
      toast.info("You don't have a Personal ID yet. Make a comment first to get one.");
    }
  };

  const handleShowAllComments = () => {
    setPersonalIdFilter(null);
    toast.success("Showing all comments.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      <WelcomeHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-orange-200">
          <CommentsList
            personalIdFilter={personalIdFilter}
            onShowMyComments={handleShowMyComments}
            onShowAllComments={handleShowAllComments}
          />
        </div>
      </main>
      <CookieFreeFooter />
    </div>
  );
};

export default ViewComments;
