
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import CommentsList from "@/components/CommentsList";
import ScrollToTop from "@/components/ScrollToTop";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const ViewComments = () => {
  const [personalIdFilter, setPersonalIdFilter] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");

  const handleClearSearch = () => {
    setPersonalIdFilter(null);
    setSearchInput("");
    toast.success("Showing all comments.");
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    const trimmedValue = value.trim();
    if (trimmedValue) {
      setPersonalIdFilter(trimmedValue);
    } else {
      setPersonalIdFilter(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      <WelcomeHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-orange-200">
          <h2 className="text-3xl font-bold text-center text-orange-800 mb-6 font-fun">
            Published Comments
          </h2>

          
          <CommentsList
            personalIdFilter={personalIdFilter}
          />
        </div>
      </main>
      <CookieFreeFooter />
      <ScrollToTop />
    </div>
  );
};

export default ViewComments;
