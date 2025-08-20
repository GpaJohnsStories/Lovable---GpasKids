
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import PublicStoriesTable from "@/components/PublicStoriesTable";
import WelcomeHeader from "@/components/WelcomeHeader";
import ScrollToTop from "@/components/ScrollToTop";

const Library = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewAuthorBio = (authorName: string) => {
    // Navigate to the public author bio page
    navigate(`/author/${encodeURIComponent(authorName)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      <main className="container mx-auto px-4 pt-2">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-orange-800 mb-2" style={{ fontFamily: "'Kalam', 'Caveat', cursive, sans-serif" }}>
            Library of Stories, Videos and Audio Files
          </h1>
        </div>
        
        {/* Title boxes row */}
        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-4 gap-4 max-w-4xl w-full">
            <div 
              className="p-4 text-center border-2 rounded-none"
              style={{ 
                backgroundColor: '#60a5fa', 
                borderColor: '#60a5fa',
                fontSize: '18px',
                color: '#22c55e',
                fontFamily: "'Kalam', 'Caveat', cursive, sans-serif"
              }}
            >
              Search for any word, title or author.
            </div>
            {/* Placeholder for remaining 3 boxes */}
            <div className="p-4 border-2 border-gray-300 rounded-none bg-gray-100">
              Box 2
            </div>
            <div className="p-4 border-2 border-gray-300 rounded-none bg-gray-100">
              Box 3
            </div>
            <div className="p-4 border-2 border-gray-300 rounded-none bg-gray-100">
              Box 4
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <PublicStoriesTable 
            onEditBio={handleViewAuthorBio} 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>
      </main>
      <CookieFreeFooter />
      <ScrollToTop />
    </div>
  );
};

export default Library;
