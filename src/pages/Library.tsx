
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import PublicStoriesTable from "@/components/PublicStoriesTable";
import WelcomeHeader from "@/components/WelcomeHeader";
import ResumeReadingButton from "@/components/ResumeReadingButton";


const Library = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleViewAuthorBio = (authorName: string) => {
    // Navigate to the public author bio page
    navigate(`/author/${encodeURIComponent(authorName)}`);
  };

  useEffect(() => {
    // Show thank you toast if user was redirected from donation
    if (location.state?.fromDonation) {
      toast({
        title: "Thanks for your support! 💝",
        description: "Your generosity helps keep these wonderful stories free for all children.",
        duration: 5000,
      });
      
      // Clear the state to prevent showing toast on refresh
      navigate('/library', { replace: true, state: {} });
    }
  }, [location.state, toast, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      <main className="container mx-auto px-4 pt-2">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-orange-800 mb-2" style={{ fontFamily: "'Kalam', 'Caveat', cursive, sans-serif" }}>
            Library of Stories, Videos and Audio Files
          </h1>
        </div>
        
        <div className="flex justify-center mb-6">
          <ResumeReadingButton />
        </div>
        
        <div className="mb-8">
          <PublicStoriesTable />
        </div>
      </main>
      <CookieFreeFooter />
    </div>
  );
};

export default Library;
