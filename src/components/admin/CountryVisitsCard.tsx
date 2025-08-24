import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CountryVisit {
  year: number;
  month: number;
  country_code: string;
  country_name: string;
  visit_count: number;
  last_visit_date: string;
}

export const CountryVisitsCard = () => {
  const { data: countryVisits, isLoading } = useQuery({
    queryKey: ['country-visits'],
    queryFn: async () => {
      console.log('Fetching country visits...');
      const { data, error } = await supabase
        .from('monthly_country_visits')
        .select('*')
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .order('visit_count', { ascending: false });

      if (error) {
        console.error('Error fetching country visits:', error);
        throw error;
      }

      return data as CountryVisit[];
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return (
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Globe className="h-5 w-5" />
            Country Visits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get current month data
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  const currentMonthVisits = countryVisits?.filter(
    visit => visit.year === currentYear && visit.month === currentMonth
  ) || [];

  // Get rolling 24 months data
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - 24);
  const cutoffYear = cutoffDate.getFullYear();
  const cutoffMonth = cutoffDate.getMonth() + 1;

  const rollingVisits = countryVisits?.filter(visit => {
    const visitDate = new Date(visit.year, visit.month - 1);
    return visitDate >= cutoffDate;
  }) || [];

  // Aggregate by country for rolling period
  const countryTotals = rollingVisits.reduce((acc, visit) => {
    const key = visit.country_code;
    if (!acc[key]) {
      acc[key] = {
        country_code: visit.country_code,
        country_name: visit.country_name,
        total_visits: 0
      };
    }
    acc[key].total_visits += visit.visit_count;
    return acc;
  }, {} as Record<string, { country_code: string; country_name: string; total_visits: number }>);

  const topCountries = Object.values(countryTotals)
    .sort((a, b) => b.total_visits - a.total_visits)
    .slice(0, 10);

  const totalCurrentMonth = currentMonthVisits.reduce((sum, visit) => sum + visit.visit_count, 0);
  const totalRolling24 = topCountries.reduce((sum, country) => sum + country.total_visits, 0);

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-blue-700">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Country Visits
          </div>
          <Badge variant="outline" className="text-blue-600 border-blue-300">
            {totalRolling24} total (24mo)
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Month Top Countries */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            This Month ({currentMonth}/{currentYear}) - {totalCurrentMonth} visits
          </h4>
          {currentMonthVisits.length > 0 ? (
            <div className="space-y-2">
              {currentMonthVisits.slice(0, 5).map((visit) => (
                <div key={`${visit.country_code}-current`} className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-500 w-8">{visit.country_code}</span>
                    <span>{visit.country_name}</span>
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {visit.visit_count}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No visits this month yet</p>
          )}
        </div>

        {/* Rolling 24 months */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Top Countries (Rolling 24 Months)
          </h4>
          {topCountries.length > 0 ? (
            <div className="space-y-2">
              {topCountries.map((country) => (
                <div key={`${country.country_code}-rolling`} className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-500 w-8">{country.country_code}</span>
                    <span>{country.country_name}</span>
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {country.total_visits}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No country data available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};