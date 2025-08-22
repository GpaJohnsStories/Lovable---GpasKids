
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

          <div className="my-6 flex flex-col md:flex-row gap-4 justify-between items-start">
            <div className="p-4 bg-amber-100/60 rounded-lg border-2 border-orange-200 w-full md:w-80 lg:w-96">
              <p className="text-21px text-orange-700 text-center font-fun">
                💡 <strong>Privacy Note:</strong> Personal IDs in the list show only the first 4 characters (like ABCD**) for privacy. 
                To see your own comments, enter your complete 6-character Personal ID below.
              </p>
            </div>

            <div className="p-4 bg-white/60 rounded-lg border-2 border-orange-200 w-full md:w-80 lg:w-96">
              <div className="flex flex-col items-center gap-4">
                <p className="text-21px text-orange-700 text-center font-fun">
                  <strong>Enter Your Personal ID:</strong>
                </p>
                <div className="flex items-center gap-2">
                  <InputOTP 
                    maxLength={6}
                    value={searchInput}
                    onChange={(value) => handleSearchChange(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  {searchInput && (
                    <Button 
                      onClick={handleClearSearch}
                      variant="outline" 
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
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
