import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import LoadingSpinner from "@/components/LoadingSpinner";
import ContentProtection from "@/components/ContentProtection";
import ScrollToTop from "@/components/ScrollToTop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Bio {
  id: string;
  bio_subject_name: string;
  title: string;
  author: string;
  excerpt: string;
  photo_link_1: string;
}

const PublicAuthorBiosSimple = () => {
  console.log('🔍 PublicAuthorBiosSimple: Component mounting');

  const { data: bios, isLoading, error } = useQuery({
    queryKey: ['author-biographies'],
    queryFn: async () => {
      console.log('🔍 AuthorBiographies: Starting query');
      try {
        // @ts-ignore - Bypass complex type inference issue
        const response = await supabase
          .from('stories')
          .select('id, bio_subject_name, title, author, excerpt, photo_link_1')
          .eq('category', 'BioText')
          .eq('published', 'Y')
          .order('bio_subject_name');
        
        console.log('🔍 AuthorBiographies: Query result', response);
        
        if (response.error) {
          console.error('🚨 AuthorBiographies: Query error:', response.error);
          throw response.error;
        }
        
        return response.data || [];
      } catch (err) {
        console.error('🚨 AuthorBiographies: Catch block error:', err);
        throw err;
      }
    },
  });

  console.log('🔍 AuthorBiographies: Render state', { isLoading, error, biosCount: bios?.length });

  if (error) {
    console.error('🚨 AuthorBiographies: Rendering error state:', error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Biographies</h2>
                <p className="text-gray-700 mb-4">
                  We encountered an error while loading the biographies.
                </p>
                <p className="text-sm text-gray-500">
                  Error: {error?.message || 'Unknown error'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <CookieFreeFooter />
        <ScrollToTop />
      </div>
    );
  }

  if (isLoading) {
    console.log('🔍 AuthorBiographies: Rendering loading state');
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        <LoadingSpinner message="Loading biographies..." />
        <CookieFreeFooter />
        <ScrollToTop />
      </div>
    );
  }

  console.log('🔍 AuthorBiographies: Rendering success state');
  return (
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
                  Author Biographies
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bios && bios.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bios.map((bio) => (
                      <Card key={bio.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        {bio.photo_link_1 && (
                          <div className="aspect-video overflow-hidden">
                            <img 
                              src={bio.photo_link_1} 
                              alt={`Portrait of ${bio.bio_subject_name}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h3 className="text-xl font-bold text-amber-800 mb-2">
                            {bio.bio_subject_name}
                          </h3>
                          <p className="text-sm text-amber-600 mb-2">
                            by {bio.author}
                          </p>
                          {bio.excerpt && (
                            <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                              {bio.excerpt}
                            </p>
                          )}
                          <div className="flex justify-center">
                            <a 
                              href={`/author/${encodeURIComponent(bio.bio_subject_name || '')}`}
                              className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                              View Biography
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-amber-700 text-lg">
                      No biographies are currently available.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <CookieFreeFooter />
        <ScrollToTop />
      </div>
  );
};

export default PublicAuthorBiosSimple;