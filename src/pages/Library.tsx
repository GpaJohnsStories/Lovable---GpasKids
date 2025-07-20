
import { useNavigate } from "react-router-dom";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import PublicStoriesTable from "@/components/PublicStoriesTable";
import WelcomeHeader from "@/components/WelcomeHeader";
import ScrollToTop from "@/components/ScrollToTop";
import ContentProtection from "@/components/ContentProtection";
import LibraryInstructions from "@/components/LibraryInstructions";

const Library = () => {
  const navigate = useNavigate();

  const handleViewAuthorBio = (authorName: string) => {
    // Navigate to the public author bio page
    navigate(`/author/${encodeURIComponent(authorName)}`);
  };

  return (
    <ContentProtection enableProtection={true}>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        <main className="container mx-auto px-4 pt-2">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold text-orange-800 mb-2" style={{ fontFamily: "'Kalam', 'Caveat', cursive, sans-serif" }}>
              Library of Stories, Videos and Audio Files
            </h1>
          </div>
          
          <LibraryInstructions />
          
          <div className="mb-8">
            <PublicStoriesTable onEditBio={handleViewAuthorBio} />
          </div>
        </main>
        <CookieFreeFooter />
        <ScrollToTop />
      </div>
    </ContentProtection>
  );
};

export default Library;
