
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import CommentsList from "@/components/CommentsList";
import ContentProtection from "@/components/ContentProtection";
import { useState } from "react";
import { getPersonalId } from "@/utils/personalId";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const ViewComments = () => {
  const [personalIdFilter, setPersonalIdFilter] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");

  const handleShowMyComments = () => {
    const personalId = getPersonalId();
    if (personalId) {
      setPersonalIdFilter(personalId);
      setSearchInput(personalId);
      toast.success(`Showing only comments for your Personal Code: ${personalId}`);
    } else {
      toast.info("You don't have a Personal Code yet. Make a comment first to get one.");
    }
  };

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
    <ContentProtection enableProtection={true}>
      <div className="flex flex-col min-h-screen bg-amber-50">
        <WelcomeHeader />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-orange-200">
            <h2 className="text-3xl font-bold text-center text-orange-800 mb-6 font-fun">
              Published Comments
            </h2>

            <div className="my-6 p-4 bg-amber-100/60 rounded-lg border-2 border-orange-200">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2 flex-grow">
                  <Search className="h-4 w-4 text-orange-600" />
                  <Input
                    type="text"
                    value={searchInput}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search by Personal Code..."
                    className="flex-grow font-fun"
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
                <Button 
                  onClick={handleShowMyComments} 
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-fun text-base whitespace-nowrap"
                >
                  Use My Code
                </Button>
              </div>
            </div>
            
            <CommentsList
              personalIdFilter={personalIdFilter}
            />
          </div>
        </main>
        <CookieFreeFooter />
      </div>
    </ContentProtection>
  );
};

export default ViewComments;
