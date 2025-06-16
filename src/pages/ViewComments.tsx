
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import CommentsList from "@/components/CommentsList";
import ContentProtection from "@/components/ContentProtection";
import { useState } from "react";
import { getPersonalId } from "@/utils/personalId";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ViewComments = () => {
  const [personalIdFilter, setPersonalIdFilter] = useState<string | null>(null);
  const [manualIdInput, setManualIdInput] = useState<string>("");

  const handleShowMyComments = () => {
    const personalId = getPersonalId();
    if (personalId) {
      setPersonalIdFilter(personalId);
      setManualIdInput(personalId);
      toast.success(`Showing only comments for your Personal Code: ${personalId}`);
    } else {
      toast.info("You don't have a Personal Code yet. Make a comment first to get one.");
    }
  };

  const handleShowAllComments = () => {
    setPersonalIdFilter(null);
    setManualIdInput("");
    toast.success("Showing all comments.");
  };

  const handleFilterByInput = () => {
    const trimmedInput = manualIdInput.trim();
    if (trimmedInput) {
      setPersonalIdFilter(trimmedInput);
      toast.success(`Filtering by Personal Code: ${trimmedInput}`);
    } else {
      setPersonalIdFilter(null);
      toast.info("Input is empty. Showing all comments.");
    }
  };
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleFilterByInput();
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
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
                <div className="flex-grow sm:flex-grow-0">
                  <Label htmlFor="personalIdInput" className="font-fun text-orange-800 text-base mb-1 block text-center sm:text-left">
                    Filter by Personal Code
                  </Label>
                  <Input
                    id="personalIdInput"
                    type="text"
                    value={manualIdInput}
                    onChange={(e) => setManualIdInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter Personal Code"
                    className="w-full sm:w-64 font-fun"
                  />
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0 sm:self-end flex-wrap justify-center">
                  <Button onClick={handleFilterByInput} className="bg-blue-500 hover:bg-blue-600 text-white font-fun text-base">
                    Filter
                  </Button>
                  <Button onClick={handleShowMyComments} className="bg-cyan-500 hover:bg-cyan-600 text-white font-fun text-base">
                    Use My Code
                  </Button>
                  <Button onClick={handleShowAllComments} className="bg-emerald-500 hover:bg-emerald-600 text-white font-fun text-base">
                    Show All
                  </Button>
                </div>
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
