
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import LoadingSpinner from "@/components/LoadingSpinner";
import ContentProtection from "@/components/ContentProtection";
import ScrollToTop from "@/components/ScrollToTop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PublicAuthorBiosSimple = () => {
  console.log('🔍 PublicAuthorBiosSimple: Component mounting');

  const { data: bios, isLoading, error } = useQuery({
    queryKey: ['public-author-bios-simple'],
    queryFn: async () => {
      console.log('🔍 PublicAuthorBiosSimple: Starting query');
      try {
        const { data, error } = await supabase
          .from('author_bios')
          .select('id, author_name')
          .limit(5);
        
        console.log('🔍 PublicAuthorBiosSimple: Query result', { data, error });
        
        if (error) {
          console.error('🚨 PublicAuthorBiosSimple: Query error:', error);
          throw error;
        }
        
        return data || [];
      } catch (err) {
        console.error('🚨 PublicAuthorBiosSimple: Catch block error:', err);
        throw err;
      }
    },
  });

  console.log('🔍 PublicAuthorBiosSimple: Render state', { isLoading, error, biosCount: bios?.length });

  if (error) {
    console.error('🚨 PublicAuthorBiosSimple: Rendering error state:', error);
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
    console.log('🔍 PublicAuthorBiosSimple: Rendering loading state');
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        <LoadingSpinner message="Loading author biographies (simple)..." />
        <CookieFreeFooter />
        <ScrollToTop />
      </div>
    );
  }

  console.log('🔍 PublicAuthorBiosSimple: Rendering success state');
  return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle 
                  className="text-3xl font-bold text-amber-800 text-center"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Authors (Simple View)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p 
                  className="text-amber-700 text-center text-lg leading-relaxed mb-4"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Testing simplified author biographies page.
                </p>
                
                {bios && bios.length > 0 ? (
                  <div className="space-y-2">
                    {bios.map((bio) => (
                      <div key={bio.id} className="p-3 bg-amber-50 rounded border">
                        <p className="font-semibold text-amber-800">
                          {bio.author_name}
                        </p>
                        <p className="text-sm text-amber-600">ID: {bio.id}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-amber-700 text-lg">
                      No author biographies found.
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
