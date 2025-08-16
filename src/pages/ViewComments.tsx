
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import CommentsList from "@/components/CommentsList";
import ScrollToTop from "@/components/ScrollToTop";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

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

          <div className="my-6 p-4 bg-amber-100/60 rounded-lg border-2 border-orange-200">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-orange-600" />
                <Input
                  type="text"
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Enter your full 6-character Personal ID..."
                  className="w-80 font-fun"
                />
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
              <p className="text-sm text-orange-700 text-center max-w-md">
                💡 <strong>Privacy Note:</strong> Personal IDs in the list show only the first 4 characters (like ABCD**) for privacy. 
                To see your own comments, enter your complete 6-character Personal ID above.
              </p>
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
