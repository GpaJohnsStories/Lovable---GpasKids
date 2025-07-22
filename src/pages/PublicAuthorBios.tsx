
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import LoadingSpinner from "@/components/LoadingSpinner";
import ContentProtection from "@/components/ContentProtection";
import ScrollToTop from "@/components/ScrollToTop";
import PublicAuthorBiosTable from "@/components/PublicAuthorBiosTable";
import AuthorBioModal from "@/components/AuthorBioModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthorBio {
  id: string;
  author_name: string;
  bio_content: string | null;
  born_date: string | null;
  died_date: string | null;
  native_country_name: string | null;
  native_language: string | null;
}

const PublicAuthorBios = () => {
  const [selectedBio, setSelectedBio] = useState<AuthorBio | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: bios, isLoading } = useQuery({
    queryKey: ['public-author-bios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('author_bios')
        .select('*')
        .order('author_name', { ascending: true });
      
      if (error) {
        console.error('Error fetching author bios:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  const handleViewBio = (bio: AuthorBio) => {
    setSelectedBio(bio);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBio(null);
  };

  if (isLoading) {
    return (
      <ContentProtection enableProtection={true}>
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
          <WelcomeHeader />
          <LoadingSpinner message="Loading author biographies..." />
          <CookieFreeFooter />
          <ScrollToTop />
        </div>
      </ContentProtection>
    );
  }

  return (
    <ContentProtection enableProtection={true}>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle 
                  className="text-3xl font-bold text-amber-800 text-center"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Meet Our Story Authors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p 
                  className="text-amber-700 text-center text-lg leading-relaxed"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Discover the talented authors who bring Grandpa's stories to life. 
                  Click "View Bio" to learn more about each author's background and journey.
                </p>
              </CardContent>
            </Card>

            {bios && bios.length > 0 ? (
              <PublicAuthorBiosTable 
                bios={bios} 
                onViewBio={handleViewBio}
              />
            ) : (
              <Card>
                <CardContent className="p-8">
                  <div className="text-center py-8">
                    <p 
                      className="text-amber-700 text-lg"
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                    >
                      No author biographies are currently available.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <AuthorBioModal 
          bio={selectedBio}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
        
        <CookieFreeFooter />
        <ScrollToTop />
      </div>
    </ContentProtection>
  );
};

export default PublicAuthorBios;
