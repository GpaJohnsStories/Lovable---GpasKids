
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import LoadingSpinner from "@/components/LoadingSpinner";
import ContentProtection from "@/components/ContentProtection";

import PublicAuthorBiosTable from "@/components/PublicAuthorBiosTable";
import AuthorBioModal from "@/components/AuthorBioModal";
import { Card, CardContent } from "@/components/ui/card";

interface AuthorBio {
  id: string;
  author_name: string;
  bio_content: string | null;
  born_date: string | null;
  died_date: string | null;
  native_country_name: string | null;
  native_language: string | null;
  photo_url: string | null;
  photo_alt: string | null;
}

const PublicAuthorBios = () => {
  console.log('🔍 PublicAuthorBios: Component mounting');
  
  const [selectedBio, setSelectedBio] = useState<AuthorBio | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: bios, isLoading, error } = useQuery({
    queryKey: ['public-author-bios'],
    queryFn: async () => {
      console.log('🔍 PublicAuthorBios: Starting database query');
      
      try {
        const { data, error } = await supabase
          .from('author_bios')
          .select('*')
          .order('author_name', { ascending: true });
        
        console.log('🔍 PublicAuthorBios: Query completed', { 
          dataLength: data?.length, 
          error: error?.message 
        });
        
        if (error) {
          console.error('🚨 PublicAuthorBios: Database error:', error);
          throw error;
        }
        
        return data || [];
      } catch (err) {
        console.error('🚨 PublicAuthorBios: Query catch block:', err);
        throw err;
      }
    },
    retry: 2,
    retryDelay: 1000
  });

  const handleViewBio = (bio: AuthorBio) => {
    console.log('🔍 PublicAuthorBios: Opening bio modal for:', bio.author_name);
    setSelectedBio(bio);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('🔍 PublicAuthorBios: Closing bio modal');
    setIsModalOpen(false);
    setSelectedBio(null);
  };

  console.log('🔍 PublicAuthorBios: Render state', { 
    isLoading, 
    hasError: !!error, 
    biosCount: bios?.length 
  });

  if (error) {
    console.error('🚨 PublicAuthorBios: Rendering error state:', error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Authors</h2>
                <p className="text-gray-700 mb-4">
                  We encountered an error while loading the author biographies.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Error: {error?.message || 'Unknown error'}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
        <CookieFreeFooter />
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <PublicAuthorBiosTable 
              bios={bios || []} 
              onViewBio={handleViewBio}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        <AuthorBioModal 
          bio={selectedBio}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
        
        <CookieFreeFooter />
      </div>
  );
};

export default PublicAuthorBios;
