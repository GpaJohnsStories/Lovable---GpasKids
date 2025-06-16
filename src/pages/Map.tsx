
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Users, MapPin } from "lucide-react";

interface VisitorData {
  country_code: string;
  country_name: string;
  visit_count: number;
  last_visit: string;
}

const Map = () => {
  const [visitorTracked, setVisitorTracked] = useState(false);

  // Track the current visitor
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const { data } = await supabase.functions.invoke('track-visitor');
        console.log('Visitor tracking result:', data);
        setVisitorTracked(true);
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    if (!visitorTracked) {
      trackVisitor();
    }
  }, [visitorTracked]);

  // Fetch visitor statistics
  const { data: visitorStats, isLoading, error } = useQuery({
    queryKey: ['visitor-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visitor_countries')
        .select('*')
        .order('visit_count', { ascending: false });
      
      if (error) {
        console.error('Error fetching visitor stats:', error);
        throw error;
      }
      
      return data as VisitorData[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const totalVisitors = visitorStats?.reduce((sum, country) => sum + country.visit_count, 0) || 0;
  const totalCountries = visitorStats?.length || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        <LoadingSpinner message="Loading visitor map..." />
        <CookieFreeFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
        <WelcomeHeader />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-orange-800 mb-4">Error Loading Map</h2>
              <p className="text-orange-700">Unable to load visitor statistics at this time.</p>
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
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-orange-800 mb-4 flex items-center justify-center gap-3">
              <Globe className="h-10 w-10" />
              Visitor World Map
            </h1>
            <p className="text-lg text-orange-700">
              See where our visitors are coming from around the world
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  Total Visitors
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-orange-800">{totalVisitors}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  Countries
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-orange-800">{totalCountries}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <Globe className="h-5 w-5 text-orange-600" />
                  Most Popular
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-lg font-bold text-orange-800">
                  {visitorStats?.[0]?.country_name || 'N/A'}
                </div>
                <div className="text-sm text-orange-600">
                  {visitorStats?.[0]?.visit_count || 0} visits
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visitor Countries List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <MapPin className="h-6 w-6 text-orange-600" />
                Visitor Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {visitorStats && visitorStats.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visitorStats.map((country) => (
                    <div
                      key={country.country_code}
                      className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-orange-800 flex items-center gap-2">
                            <span className="text-2xl">
                              {String.fromCodePoint(
                                ...country.country_code
                                  .toUpperCase()
                                  .split('')
                                  .map(char => 127397 + char.charCodeAt(0))
                              )}
                            </span>
                            {country.country_name}
                          </div>
                          <div className="text-sm text-orange-600">
                            {country.visit_count} visitor{country.visit_count !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-orange-500">
                            Last visit
                          </div>
                          <div className="text-xs text-orange-600">
                            {new Date(country.last_visit).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Globe className="h-16 w-16 text-orange-300 mx-auto mb-4" />
                  <p className="text-orange-600">No visitor data available yet.</p>
                  <p className="text-sm text-orange-500 mt-2">
                    Visitor tracking is active and data will appear as visitors browse the site.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-800 mb-2">Privacy Notice</h3>
              <p className="text-sm text-blue-700">
                We respect your privacy. Our visitor tracking only collects country-level location data 
                and does not store personal information or exact IP addresses. Data is aggregated for 
                analytics purposes only.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <CookieFreeFooter />
    </div>
  );
};

export default Map;
