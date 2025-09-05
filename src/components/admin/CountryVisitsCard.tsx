import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
    .slice(0, 84); // Up to 84 countries to fill 21 rows x 4 columns

  // Sort current month visits by count
  const sortedCurrentMonth = [...currentMonthVisits]
    .sort((a, b) => b.visit_count - a.visit_count)
    .slice(0, 84); // Up to 84 countries to fill 21 rows x 4 columns

  const totalCurrentMonth = currentMonthVisits.reduce((sum, visit) => sum + visit.visit_count, 0);
  const totalRolling24 = topCountries.reduce((sum, country) => sum + country.total_visits, 0);

  // Helper function to render country table
  const renderCountryTable = (countries: any[], isCurrentMonth = false) => {
    if (countries.length === 0) {
      return <p className="text-sm text-gray-500 italic">No data available</p>;
    }

    // Create 21 rows with 4 columns each (3 data columns per section)
    const rows = [];
    for (let i = 0; i < 21; i++) {
      const row = [];
      for (let j = 0; j < 4; j++) {
        const index = i + (j * 21);
        if (index < countries.length) {
          const country = countries[index];
          row.push({
            code: country.country_code,
            name: country.country_name,
            count: isCurrentMonth ? country.visit_count : country.total_visits
          });
        } else {
          row.push(null);
        }
      }
      rows.push(row);
    }

    return (
      <div className="border-2 border-amber-600 rounded-md overflow-hidden">
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="border-b border-amber-400">
              <TableHead className="w-16 text-center font-bold h-8 border-r border-amber-300">Code</TableHead>
              <TableHead className="w-32 font-bold h-8 border-r border-amber-300">Country</TableHead>
              <TableHead className="w-16 text-center font-bold h-8 border-r border-amber-400">Count</TableHead>
              <TableHead className="w-16 text-center font-bold h-8 border-r border-amber-300">Code</TableHead>
              <TableHead className="w-32 font-bold h-8 border-r border-amber-300">Country</TableHead>
              <TableHead className="w-16 text-center font-bold h-8 border-r border-amber-400">Count</TableHead>
              <TableHead className="w-16 text-center font-bold h-8 border-r border-amber-300">Code</TableHead>
              <TableHead className="w-32 font-bold h-8 border-r border-amber-300">Country</TableHead>
              <TableHead className="w-16 text-center font-bold h-8 border-r border-amber-400">Count</TableHead>
              <TableHead className="w-16 text-center font-bold h-8 border-r border-amber-300">Code</TableHead>
              <TableHead className="w-32 font-bold h-8 border-r border-amber-300">Country</TableHead>
              <TableHead className="w-16 text-center font-bold h-8">Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="border-b border-amber-200 h-6">
                {row.map((country, colIndex) => (
                  <React.Fragment key={colIndex}>
                    <TableCell className={`text-center font-mono text-xs py-1 h-6 ${colIndex < 3 && colIndex !== 2 ? 'border-r border-amber-200' : colIndex === 2 ? 'border-r border-amber-300' : ''}`}>
                      {country?.code || '\u00A0'}
                    </TableCell>
                    <TableCell className={`text-xs py-1 h-6 ${colIndex < 3 && colIndex !== 2 ? 'border-r border-amber-200' : colIndex === 2 ? 'border-r border-amber-300' : ''}`}>
                      {country?.name || '\u00A0'}
                    </TableCell>
                    <TableCell className={`text-center text-xs font-semibold py-1 h-6 ${colIndex < 3 ? 'border-r border-amber-300' : ''}`}>
                      {country?.count || '\u00A0'}
                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

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
          {renderCountryTable(sortedCurrentMonth, true)}
        </div>

        {/* Rolling 24 months */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Top Countries (Rolling 24 Months)
          </h4>
          {renderCountryTable(topCountries, false)}
        </div>
      </CardContent>
    </Card>
  );
};